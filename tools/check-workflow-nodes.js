const postgres = require('/home/jerytom33/.gemini/antigravity/scratch/whatsapp-integration/workflow-builder/node_modules/postgres');
const dotenv = require('/home/jerytom33/.gemini/antigravity/scratch/whatsapp-integration/workflow-builder/node_modules/dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../workflow-builder/.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const client = postgres(process.env.DATABASE_URL);

async function checkWorkflow() {
    try {
        const workflows = await client`
        SELECT id, nodes FROM workflows 
        WHERE id = '6gsz8a05cyerxddicr64j'
    `;

        console.log(`Found ${workflows.length} specific workflows:`);
        workflows.forEach(w => {
            console.log(`- ID: ${w.id}`);
            console.log(`  Nodes JSON:`, JSON.stringify(w.nodes, null, 2));
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkWorkflow();
