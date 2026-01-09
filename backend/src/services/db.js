const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize Database Schema
const initDb = async () => {
    const client = await pool.connect();
    try {
        console.log('Initializing Database...');

        // Create Conversations Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        contact_name VARCHAR(100),
        last_message_preview TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Create Messages Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id),
        direction VARCHAR(10) CHECK (direction IN ('INBOUND', 'OUTBOUND')),
        type VARCHAR(20),
        content JSONB,
        status VARCHAR(20),
        whatsapp_message_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log('Database Schema Verified.');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        client.release();
    }
};

// Helper: Upsert Conversation
const upsertConversation = async (phoneNumber, contactName, lastMessage) => {
    const query = `
    INSERT INTO conversations (phone_number, contact_name, last_message_preview, updated_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (phone_number) 
    DO UPDATE SET 
      contact_name = COALESCE(EXCLUDED.contact_name, conversations.contact_name),
      last_message_preview = EXCLUDED.last_message_preview,
      updated_at = NOW()
    RETURNING *;
  `;
    const values = [phoneNumber, contactName, lastMessage];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Helper: Save Message
const saveMessage = async (conversationId, direction, type, content, status, whatsappId) => {
    const query = `
    INSERT INTO messages (conversation_id, direction, type, content, status, whatsapp_message_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
    const values = [conversationId, direction, type, content, status, whatsappId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Helper: Get All Conversations
const getConversations = async () => {
    const res = await pool.query('SELECT * FROM conversations ORDER BY updated_at DESC');
    return res.rows;
};

// Helper: Get Messages for Conversation
const getMessages = async (phoneNumber) => {
    const res = await pool.query(`
        SELECT m.* FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE c.phone_number = $1
        ORDER BY m.created_at ASC
    `, [phoneNumber]);
    return res.rows;
};

module.exports = {
    pool,
    initDb,
    upsertConversation,
    saveMessage,
    getConversations,
    getMessages
};
