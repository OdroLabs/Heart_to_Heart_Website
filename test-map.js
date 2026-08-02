const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const settings = await prisma.setting.findUnique({ where: { key: 'map_embed' }});
  console.log(settings);
}
main().catch(console.error).finally(() => prisma.$disconnect());
