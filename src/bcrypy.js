import bcrypt from "bcryptjs";
import { db } from './database/connection.database.js';

const updatePasswords = async () => {
    try {
        const users = await db.query('SELECT id, password FROM users WHERE password IS NOT NULL');

        for (const user of users.rows) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
            console.log(`Password for user ID ${user.id} updated successfully.`);
        }

        console.log('All passwords have been updated.');
    } catch (error) {
        console.error('Error updating passwords:', error);
    } finally {
        await db.end();
    }
};

updatePasswords();
