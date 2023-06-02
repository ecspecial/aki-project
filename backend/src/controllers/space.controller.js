import { db } from '../../config/dbConfig.js';
import fs from 'fs-extra';

class spaceController {
    async createSpace (req, res) {
        const user_id = req.params.id
        const { space_name, industry, description, address, operating_hours, price } = req.body;

        const insertQuery = `
          INSERT INTO spaces (user_id, space_name, industry, description, address, operating_hours, price)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;

        try {
            const newSpace = await db.query(insertQuery, [user_id, space_name, industry, description, address, operating_hours, price]);
            res.json(newSpace.rows[0]);
          } catch (error) {
            console.error('Error creating space:', error);
            res.status(500).json({ error: 'Failed to create space' });
          }
    }

    async getOneOrganisationSpace(req, res) {
        const { id, spaceId } = req.params;
    
        const selectQuery = `
            SELECT * FROM spaces
            WHERE user_id = $1 AND id = $2;
        `;
    
        try {
            const space = await db.query(selectQuery, [id, spaceId]);
            if (space.rows.length === 0) {
                return res.status(404).json({ error: 'Space not found' });
            }
            res.json(space.rows[0]);
        } catch (error) {
            console.error('Error getting space:', error);
            res.status(500).json({ error: 'Failed to get space' });
        }
    }

    async getAllOrganisationSpaces(req, res) {
        const { id } = req.params;
    
        const selectQuery = `
            SELECT * FROM spaces
            WHERE user_id = $1;
        `;
    
        try {
            const spaces = await db.query(selectQuery, [id]);
            res.json(spaces.rows);
        } catch (error) {
            console.error('Error getting spaces:', error);
            res.status(500).json({ error: 'Failed to get spaces' });
        }
    }

    async getAllSpaces(req, res) {
        const selectQuery = `
            SELECT * FROM spaces;
        `;
    
        try {
            const spaces = await db.query(selectQuery);
            res.json(spaces.rows);
        } catch (error) {
            console.error('Error getting spaces:', error);
            res.status(500).json({ error: 'Failed to get spaces' });
        }
      }

    async updateSpace(req, res) {
        const { id, spaceId } = req.params;
        const { space_name, industry, description, address, operating_hours, price } = req.body;
    
        const updateQuery = `
            UPDATE spaces
            SET space_name = $1, industry = $2, description = $3, address = $4, operating_hours = $5, price = $6
            WHERE user_id = $7 AND id = $8
            RETURNING *;
        `;
    
        try {
            const updatedSpace = await db.query(updateQuery, [space_name, industry, description, address, operating_hours, price, id, spaceId]);
            if (updatedSpace.rows.length === 0) {
                return res.status(404).json({ error: 'Space not found' });
            }
            res.json(updatedSpace.rows[0]);
        } catch (error) {
            console.error('Error updating space:', error);
            res.status(500).json({ error: 'Failed to update space' });
        }
    }

    async uploadSpaceImages(req, res) {
        const { id, spaceId } = req.params;
    
        try {
            await db.query('BEGIN'); // Start transaction
    
            const images = [];
            for (let i = 0; i < req.files.length; i++) {
                const fileName = req.files[i].filename;
                images.push(fileName);
    
                const insertQuery = `
                    UPDATE spaces
                    SET photos = array_append(photos, $1)
                    WHERE user_id = $2 AND id = $3;
                `;
                await db.query(insertQuery, [fileName, id, spaceId]);
            }
    
            await db.query('COMMIT'); // Commit transaction
    
            res.status(200).json({
                statusCode: 200,
                status: true,
                message: 'All images added',
                data: images
            });
        } catch (error) {
            await db.query('ROLLBACK'); // Rollback transaction
            console.error('Error uploading space images:', error);
            res.status(500).json({ error: 'Failed to upload space images' });
        }
    }
    
    async deleteSpace(req, res) {
        const { id, spaceId } = req.params;
    
        const deleteQuery = `
            DELETE FROM spaces
            WHERE user_id = $1 AND id = $2
            RETURNING *;
        `;
    
        try {
            await db.query('BEGIN'); // Start transaction

            // Delete space pictures
            const spacePicturesFolder = `images/spacepictures/${id}/${spaceId}`;
            if (await fs.pathExists(spacePicturesFolder)) {
                await fs.remove(spacePicturesFolder);
            }

            const deletedSpace = await db.query(deleteQuery, [id, spaceId]);
            if (deletedSpace.rows.length === 0) {
                await db.query('ROLLBACK'); // Rollback transaction
                return res.status(404).json({ error: 'Space not found' });
            }
            await db.query('COMMIT'); // Commit transaction
            res.json({ message: 'User data deleted successfully' });
        } catch (error) {
            await db.query('ROLLBACK'); // Rollback transaction
            console.error('Error deleting space:', error);
            res.status(500).json({ error: 'Failed to delete space' });
        }
    }

}

export default new spaceController();