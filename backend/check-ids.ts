import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
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
