import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const cat = await prisma.mockTestCategory.create({ data: { name: 'Test Category ' + Date.now() } });
    console.log('Created category:', cat);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
