import { db } from "../../config/dbConfig.js";

class userController {
    async createUser(req, res) {
        const { email, password, role } = req.body;
        const checkQuery = `
          SELECT * FROM users
          WHERE email = $1;
        `;
        const insertQuery = `
          INSERT INTO users (email, password, role)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;
        try {
          const checkUser = await db.query(checkQuery, [email]);
          if (checkUser.rows.length > 0) {
            return res.status(409).json({ error: "User already exists" });
          }
          const newUser = await db.query(insertQuery, [email, String(password), role]);
          res.json(newUser.rows[0]);
        } catch (error) {
          console.error("Error creating user:", error);
          res.status(500).json({ error: "Failed to create user" });
        }
    }

    async getUsers(req, res) {
        const query = `
            SELECT * FROM users;
        `;
        try {
            const users = await db.query(query);
            res.json(users.rows);
        } catch (error) {
            console.error("Error retrieving users:", error);
            res.status(500).json({ error: "Failed to retrieve users" });
        }
    }

    async getOneUser(req, res) {
        const { id } = req.params;
        const query = `
            SELECT * FROM users WHERE id = $1;
        `;
        try {
            const user = await db.query(query, [id]);
            if (user.rows.length === 0) {
                res.status(404).json({ error: "User not found" });
            } else {
                res.json(user.rows[0]);
            }
        } catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ error: "Failed to retrieve user" });
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const { email, password, role } = req.body;
        const query = `
            UPDATE users
            SET email = $1, password = $2, role = $3
            WHERE id = $4
            RETURNING *;
        `;
        try {
            const updatedUser = await db.query(query, [email, password, role, id]);
            if (updatedUser.rows.length === 0) {
                res.status(404).json({ error: "User not found" });
            } else {
                res.json(updatedUser.rows[0]);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ error: "Failed to update user" });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        const query = `
            DELETE FROM users
            WHERE id = $1
            RETURNING *;
        `;
        try {
            const deletedUser = await db.query(query, [id]);
            if (deletedUser.rows.length === 0) {
                res.status(404).json({ error: "User not found" });
            } else {
                res.json({ message: "User deleted successfully" });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ error: "Failed to delete user" });
        }
    }
}

export default new userController();