
const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const { workflowExecutions } = require('../workflow-builder/lib/db/schema');
const { desc } = require('drizzle-orm');
const path = require('path');

// Determine DB path - assuming shared DB or local to workflow-builder
// Based on previous logs, it seems to be using a local sqlite db
const dbPath = path.resolve(__dirname, '../workflow-builder/sqlite.db');
console.log('Using DB path:', dbPath);

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

async function checkExecutions() {
    try {
        const executions = await db.select().from(workflowExecutions).orderBy(desc(workflowExecutions.startedAt)).limit(5);
        console.log('Latest 5 Executions:');
        executions.forEach(exec => {
            console.log(`ID: ${exec.id}, Status: ${exec.status}, WorkflowID: ${exec.workflowId}, CreatedAt: ${exec.createdAt}`);
        });
    } catch (err) {
        console.error('Error querying executions:', err);
    }
}

checkExecutions();
