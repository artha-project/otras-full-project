"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const exams = await prisma.exam.findMany({ select: { id: true, name: true } });
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    const fs = require('fs');
    const output = {
        exams,
        users
    };
    fs.writeFileSync('db-ids.json', JSON.stringify(output, null, 2));
    console.log('IDs written to db-ids.json');
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check-ids.js.map