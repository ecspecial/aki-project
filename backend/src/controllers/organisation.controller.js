import { db } from "../../config/dbConfig.js";

class organisationController {
    async createOrganisation(req, res) {
        const { full_name, email, password, role, user_position, legal_entity_name, inn } = req.body;
        const checkQuery = `
            SELECT * FROM users
            WHERE email = $1;
        `;
        const insertQuery = `
            INSERT INTO users (full_name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        const insertOrganisationQuery = `
            INSERT INTO organisations (user_id, user_position, legal_entity_name, inn)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        try {
            const checkUser = await db.query(checkQuery, [email]);
            if (checkUser.rows.length > 0) {
                return res.status(409).json({ error: "User already exists" });
            }
            const newUser = await db.query(insertQuery, [full_name, email, password, role]);
            const userId = newUser.rows[0].id;
            const newOrganisation = await db.query(insertOrganisationQuery, [userId, user_position, legal_entity_name, inn]);
            res.json(newOrganisation.rows[0]);
        } catch (error) {
            console.error("Error creating organisation:", error);
            res.status(500).json({ error: "Failed to create organisation" });
        }
    }
}

export default new organisationController();