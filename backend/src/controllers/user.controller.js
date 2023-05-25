import { db } from "../../config/dbConfig.js";
import fs from 'fs-extra';

class userController {
    async createUser(req, res) {
        const { full_name, email, password, role } = req.body;
        const checkQuery = `
          SELECT * FROM users
          WHERE email = $1;
        `;
        const insertQuery = `
          INSERT INTO users (full_name, email, password, role)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
        try {
          const checkUser = await db.query(checkQuery, [email]);
          if (checkUser.rows.length > 0) {
            return res.status(409).json({ error: "User already exists" });
          }
          const newUser = await db.query(insertQuery, [full_name, email, password, role]);
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
        const { full_name, email, password, role } = req.body;
        const query = `
            UPDATE users
            SET full_name = $1, email = $2, password = $3, role = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *;
        `;
        try {
            const checkEmailQuery = `
                SELECT id FROM users WHERE email = $1 AND id != $2;
            `;
            const checkEmail = await db.query(checkEmailQuery, [email, id]);
            if (checkEmail.rows.length > 0) {
                return res.status(409).json({ error: "Email already exists" });
            }
            
            const updatedUser = await db.query(query, [full_name, email, password, role, id]);
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

        const deleteProfilePictureQuery = `SELECT photo FROM users WHERE id = $1;`;
        const deleteBookingsQuery = `
            DELETE FROM bookings
            WHERE renter_user_id = $1 OR owner_user_id = $1;
        `;
        const deleteServicesQuery = `
            DELETE FROM services
            WHERE space_id IN (SELECT id FROM spaces WHERE user_id = $1);
        `;
        const deleteSpacesQuery = `
            DELETE FROM spaces
            WHERE user_id = $1;
        `;
        const deleteOrganisationsQuery = `
            DELETE FROM organisations
            WHERE user_id = $1;
        `;
        const deleteUserQuery = `
            DELETE FROM users
            WHERE id = $1;
        `;
    
        try {
            await db.query('BEGIN'); // Start transaction
    
            // Retrieve profile picture path
            const result = await db.query(deleteProfilePictureQuery, [id]);
            const photoPath = result.rows[0].photo;
            // Delete profile picture
            if (photoPath) {
                await fs.remove(photoPath);
            }

            // Delete space pictures
            const spacePicturesFolder = `images/spacepictures/${id}`;
            if (await fs.pathExists(spacePicturesFolder)) {
                await fs.remove(spacePicturesFolder);
            }

            await db.query(deleteBookingsQuery, [id]);
            await db.query(deleteServicesQuery, [id]);
            await db.query(deleteSpacesQuery, [id]);
            await db.query(deleteOrganisationsQuery, [id]);
            await db.query(deleteUserQuery, [id]);
    
            await db.query('COMMIT'); // Commit transaction
    
            res.json({ message: "User data deleted successfully" });
        } catch (error) {
            await db.query('ROLLBACK'); // Rollback transaction
            console.error("Error deleting user data:", error);
            res.status(500).json({ error: "Failed to delete user data" });
        }
    }

    async uploadImage(req, res) {
        const { id } = req.params;
        
        // Check if a file was uploaded
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        try {
          // Get the file path of the uploaded image
          const filePath = req.file.path;
          
          // Update the user's photo field in the database
          const updateQuery = `
            UPDATE users
            SET photo = $1
            WHERE id = $2
            RETURNING *;
          `;
          const updatedUser = await db.query(updateQuery, [filePath, id]);
          
          if (updatedUser.rows.length === 0) {
            return res.status(404).json({ error: 'Error uploading image' });
          }
          
          res.json(updatedUser.rows[0]);
        } catch (error) {
          console.error('Error uploading image:', error);
          res.status(500).json({ error: 'Failed to upload image' });
        }
      }

      async getProfilePhoto () {}
}

export default new userController();