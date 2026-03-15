"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        const cat = await prisma.mockTestCategory.create({ data: { name: 'Test Category ' + Date.now() } });
        console.log('Created category:', cat);
    }
    catch (e) {
        console.error('Error:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test-db.js.map