import { db } from '../../config/dbConfig.js';

class organisationController {
    async createOrganisation(req, res) {
        const { full_name, email, password, role, user_position, legal_entity_name, inn } = req.body;
        const checkQuery = `
            SELECT * FROM users
            WHERE email = $1;
        `;
        const checkOrganisationQuery = `
            SELECT * FROM organisations
            WHERE legal_entity_name = $1 OR inn = $2;
        `;
        const insertQuery = `
            INSERT INTO users (full_name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, full_name, email, role, rating, photo, verified, created_at, updated_at;
        `;
        const insertOrganisationQuery = `
            INSERT INTO organisations (user_id, user_position, legal_entity_name, inn)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
    
        try {
            await db.query('BEGIN'); // Start transaction
        
            const checkUser = await db.query(checkQuery, [email]);
            if (checkUser.rows.length > 0) {
                await db.query('ROLLBACK'); // Rollback transaction
                return res.status(409).json({ error: 'User with this email already exists' });
            }
        
            const checkOrganisation = await db.query(checkOrganisationQuery, [legal_entity_name, inn]);
            if (checkOrganisation.rows.length > 0) {
                await db.query('ROLLBACK'); // Rollback transaction
                const existingOrganisation = checkOrganisation.rows[0];
                let errorMessage = 'Organisation already exists';
                if (existingOrganisation.legal_entity_name === legal_entity_name) {
                    errorMessage = 'Legal entity name already exists';
                } else if (existingOrganisation.inn === inn) {
                    errorMessage = 'INN already exists';
                }
                return res.status(409).json({ error: errorMessage });
            }
        
            const newUser = await db.query(insertQuery, [full_name, email, password, role]);
            const userId = newUser.rows[0].id;
        
            const newOrganisation = await db.query(insertOrganisationQuery, [userId, user_position, legal_entity_name, inn]);
        
            const user = {
                ...newUser.rows[0],
                user_position: newOrganisation.rows[0].user_position,
                legal_entity_name: newOrganisation.rows[0].legal_entity_name,
                inn: newOrganisation.rows[0].inn
            };
        
            await db.query('COMMIT'); // Commit transaction
            res.json(user);
        } catch (error) {
            console.error('Error creating organisation:', error);
            await db.query('ROLLBACK'); // Rollback transaction
            res.status(500).json({ error: 'Failed to create organisation' });
        }
    }

    async updateOrganisation(req, res) {
        const { id } = req.params;
        const { full_name, email, user_position, legal_entity_name, inn, password } = req.body;
        const verified = false;
        const updateUserDataQuery = `
            UPDATE users
            SET full_name = $1, email = $2, password = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4;
        `;
        const updateOrganisationDataQuery = `
            UPDATE organisations
            SET user_position = $1, legal_entity_name = $2, inn = $3
            WHERE user_id = $4;
        `;
        const updateVerifiedStatusQuery = `
            UPDATE users
            SET verified = $1
            WHERE id = $2;
        `;
    
        try {
            await db.query('BEGIN'); // Start transaction
        
            const existingEmailQuery = `
                SELECT id FROM users WHERE email = $1 AND id != $2;
            `;
            const existingLegalEntityNameQuery = `
                SELECT id FROM organisations WHERE legal_entity_name = $1 AND user_id != $2;
            `;
            const existingInnQuery = `
                SELECT id FROM organisations WHERE inn = $1 AND user_id != $2;
            `;
        
            const existingEmail = await db.query(existingEmailQuery, [email, id]);
            const existingLegalEntityName = await db.query(existingLegalEntityNameQuery, [legal_entity_name, id]);
            const existingInn = await db.query(existingInnQuery, [inn, id]);
        
            if (existingEmail.rows.length > 0) {
                await db.query('ROLLBACK'); // Rollback transaction
                return res.status(400).json({ error: 'Email already exists' });
            }
        
            if (existingLegalEntityName.rows.length > 0) {
                await db.query('ROLLBACK'); // Rollback transaction
                return res.status(400).json({ error: 'Legal entity name already exists' });
            }
        
            if (existingInn.rows.length > 0) {
                await db.query('ROLLBACK'); // Rollback transaction
                return res.status(400).json({ error: 'INN already exists' });
            }
        
            await db.query(updateUserDataQuery, [full_name, email, password, id]);
        
            await db.query(updateOrganisationDataQuery, [user_position, legal_entity_name, inn, id]);
        
            await db.query(updateVerifiedStatusQuery, [verified, id]);
        
            await db.query('COMMIT'); // Commit transaction
            res.json({ message: 'Organisation updated successfully' });
        } catch (error) {
            console.error('Error updating organisation:', error);
            await db.query('ROLLBACK'); // Rollback transaction
            res.status(500).json({ error: 'Failed to update organisation' });
        }
    }

    async getOneOrganisation(req, res) {
        const { id } = req.params;
        const query = `
            SELECT users.id, users.full_name, users.email, users.role,
                organisations.user_position, organisations.legal_entity_name,
                organisations.inn, users.rating, users.photo,
                users.verified, users.created_at, users.updated_at
            FROM users
            INNER JOIN organisations
            ON users.id = organisations.user_id
            WHERE users.id = $1;
        `;
        try {
            const result = await db.query(query, [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Organisation not found' });
            }
            const user = result.rows[0];
            res.json(user);
        } catch (error) {
            console.error('Error retrieving organisation:', error);
            res.status(500).json({ error: 'Failed to retrieve organisation' });
        }
    }

    async getAllOrganisations(req, res) {
        const query = `
            SELECT users.id, users.full_name, users.email, users.role,
                organisations.user_position, organisations.legal_entity_name,
                organisations.inn, users.rating, users.photo,
                users.verified, users.created_at, users.updated_at
            FROM users
            INNER JOIN organisations
            ON users.id = organisations.user_id;
        `;
        try {
            const result = await db.query(query);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'No organisations found' });
            }
            const organisations = result.rows;
            res.json(organisations);
        } catch (error) {
            console.error('Error retrieving organisations:', error);
            res.status(500).json({ error: 'Failed to retrieve organisations' });
        }
    }
    

    async deleteOrganisation(req, res) {
        const { id } = req.params;
    
        try {
            await db.query('BEGIN'); // Start transaction
    
            // Delete bookings associated with the user
            await db.query('DELETE FROM bookings WHERE renter_user_id = $1 OR owner_user_id = $1', [id]);
    
            // Delete services associated with the user's spaces
            await db.query('DELETE FROM services WHERE space_id IN (SELECT id FROM spaces WHERE user_id = $1)', [id]);
    
            // Delete spaces associated with the user
            await db.query('DELETE FROM spaces WHERE user_id = $1', [id]);
    
            // Delete organisation
            await db.query('DELETE FROM organisations WHERE user_id = $1', [id]);
    
            // Delete user
            await db.query('DELETE FROM users WHERE id = $1', [id]);
    
            await db.query('COMMIT'); // Commit transaction
    
            res.json({ message: 'User data deleted successfully' });
        } catch (error) {
            await db.query('ROLLBACK'); // Rollback transaction
            console.error('Error deleting user data:', error);
            res.status(500).json({ error: 'Failed to delete user data' });
        }
    }
}

export default new organisationController();