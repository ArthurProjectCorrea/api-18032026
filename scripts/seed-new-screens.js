const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const screens = [
    {
      name: 'Gerenciamento de Telas',
      name_key: 'screens_manage',
      path_pattern: '/admin/screens',
    },
    {
      name: 'Gerenciamento de Permissões',
      name_key: 'permissions_manage',
      path_pattern: '/admin/permissions',
    },
    {
      name: 'Logs de Auditoria',
      name_key: 'audit_logs',
      path_pattern: '/admin/logs',
    },
  ];

  for (const s of screens) {
    // Tenta encontrar por name_key primeiro
    let existing = await prisma.screen.findUnique({
      where: { name_key: s.name_key },
    });

    // Se não encontrou por name_key, tenta encontrar por path_pattern
    if (!existing && s.path_pattern) {
      existing = await prisma.screen.findUnique({
        where: { path_pattern: s.path_pattern },
      });
    }

    if (!existing) {
      console.log(`Creating screen: ${s.name_key}`);
      await prisma.screen.create({
        data: s,
      });
    } else {
      console.log(
        `Updating existing screen for: ${s.name_key} (ID: ${existing.id})`,
      );
      await prisma.screen.update({
        where: { id: existing.id },
        data: {
          name: s.name,
          name_key: s.name_key,
          path_pattern: s.path_pattern,
        },
      });
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
