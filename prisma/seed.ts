import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Criar Departamento e Cargo Padrão
  const department = await prisma.department.upsert({
    where: { name: 'Administração' },
    update: {},
    create: { name: 'Administração' },
  });

  const position = await prisma.position.upsert({
    where: { id: 1 },
    update: { department_id: department.id },
    create: {
      id: 1,
      name: 'Administrador',
      department_id: department.id,
    },
  });

  // 2. Criar Perfil de Admin (Arthur)
  await prisma.profile.upsert({
    where: { id: 'w1j7UwRA9MVUgkqfOk3exTmSOLi1' },
    update: { position_id: position.id },
    create: {
      id: 'w1j7UwRA9MVUgkqfOk3exTmSOLi1',
      name: 'Arthur Corrêa',
      position_id: position.id,
    },
  });

  // 3. Configurações de Telas e Breadcrumbs
  const screenConfigs = [
    {
      name_key: 'users',
      name: 'Central de Usuários',
      path_pattern: '/admin/users',
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Central de Usuários' },
      ],
    },
    {
      name_key: 'departments',
      name: 'Cadastro de Departamentos',
      path_pattern: '/admin/departments',
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Cadastro de Departamentos' },
      ],
    },
    {
      name_key: 'positions',
      name: 'Gestão de Cargos',
      path_pattern: '/admin/positions',
      breadcrumb: [{ label: 'Administrador' }, { label: 'Gestão de Cargos' }],
    },
    {
      name_key: 'position_create',
      name: 'Criar Novo Cargo',
      path_pattern: '/admin/positions/create',
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Gestão de Cargos', href: '/admin/positions' },
        { label: 'Novo Cargo' },
      ],
      is_sub_screen: true,
    },
    {
      name_key: 'position_edit',
      name: 'Editar Cargo',
      path_pattern: '/admin/positions/[id]',
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Gestão de Cargos', href: '/admin/positions' },
        { label: 'Editar Cargo' },
      ],
      is_sub_screen: true,
    },
    {
      name_key: 'screens',
      name: 'Central de Telas',
      path_pattern: '/admin/screens',
      breadcrumb: [{ label: 'Administrador' }, { label: 'Central de Telas' }],
    },
    {
      name_key: 'permissions',
      name: 'Central de Permissões',
      path_pattern: '/admin/permissions',
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Central de Permissões' },
      ],
    },
  ];

  // 4. Permissões Padrão
  const permissionKeys = ['view', 'create', 'edit', 'delete'];

  for (const config of screenConfigs) {
    const screen = await prisma.screen.upsert({
      where: { name_key: config.name_key },
      update: {
        path_pattern: config.path_pattern,
        breadcrumb: config.breadcrumb,
        is_sub_screen: config.is_sub_screen || false,
      },
      create: {
        name: config.name,
        name_key: config.name_key,
        path_pattern: config.path_pattern,
        breadcrumb: config.breadcrumb,
        is_sub_screen: config.is_sub_screen || false,
      },
    });

    // Grant total access to Administrator ONLY for main screens
    if (config.is_sub_screen) continue;

    for (const pKey of permissionKeys) {
      const permission = await prisma.permission.upsert({
        where: { name_key: pKey },
        update: {},
        create: {
          name: pKey.charAt(0).toUpperCase() + pKey.slice(1),
          name_key: pKey,
        },
      });

      // Dar acesso total ao Administrador
      const exists = await prisma.access.findFirst({
        where: {
          position_id: position.id,
          screen_id: screen.id,
          permission_id: permission.id,
        },
      });

      if (!exists) {
        await prisma.access.create({
          data: {
            position_id: position.id,
            screen_id: screen.id,
            permission_id: permission.id,
            scope: 'all',
          },
        });
      }
    }
  }

  console.log('Seed completo: Schema minimalista populado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
