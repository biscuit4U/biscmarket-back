import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false // for Railway PostgreSQL
    }
});

export default pool;

console.log('Database connection attempt:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database exists:', !!process.env.DB_NAME);
console.log('User exists:', !!process.env.DB_USER);
console.log('Password exists:', !!process.env.DB_PASSWORD);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

pool.query('SELECT 1 as test')
    .then(() => console.log('✅ Database test query successful'))
    .catch(err => console.log('❌ Database test failed:', err.message));