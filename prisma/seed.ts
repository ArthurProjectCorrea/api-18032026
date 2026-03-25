import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Cast para any devido a incompatibilidade de versões de @types/pg entre prisma e o projeto
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // 1. Core Permissions
  const permissionsData = [
    { name: 'Visualizar', name_key: 'view' },
    { name: 'Criar', name_key: 'create' },
    { name: 'Editar', name_key: 'edit' },
    { name: 'Deletar', name_key: 'delete' },
    { name: 'Imprimir', name_key: 'print' }, // Adicionado Imprimir
  ];

  const dbPermissions: Record<
    string,
    { id: number; name: string; name_key: string }
  > = {};
  for (const p of permissionsData) {
    const result = await prisma.permission.upsert({
      where: { name_key: p.name_key },
      update: { name: p.name },
      create: p,
    });
    dbPermissions[p.name_key] = result;
  }

  // 1.5 Domain Data (Módulo SEEU)
  const schoolingData = [
    'Analfabeto',
    'Alfabetizado',
    'Ensino Fundamental Incompleto',
    'Ensino Fundamental Completo',
    'Ensino Médio Incompleto',
    'Ensino Médio Completo',
    'Ensino Superior Incompleto',
    'Ensino Superior Completo',
    'Pós-graduação',
  ];

  for (const s of schoolingData) {
    await prisma.schooling.upsert({
      where: { name: s },
      update: {},
      create: { name: s },
    });
  }

  const penaltyRegimes = ['Aberto', 'Semiaberto', 'Fechado'];
  for (const r of penaltyRegimes) {
    await prisma.penaltyRegime.upsert({
      where: { name: r },
      update: {},
      create: { name: r },
    });
  }

  // 2. Screens Configuration
  const screenConfigs = [
    {
      name_key: 'users',
      name: 'Gestão de Usuários',
      path_pattern: '/admin/users',
      allowedActions: ['view', 'create', 'edit', 'delete'],
      breadcrumb: [{ label: 'Administrador' }, { label: 'Gestão de Usuários' }],
    },
    {
      name_key: 'departments',
      name: 'Gestão de Departamentos',
      path_pattern: '/admin/departments',
      allowedActions: ['view', 'create', 'edit', 'delete'],
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Gestão de Departamentos' },
      ],
    },
    {
      name_key: 'positions',
      name: 'Gestão de Cargos',
      path_pattern: '/admin/positions',
      allowedActions: ['view', 'create', 'edit', 'delete'],
      breadcrumb: [{ label: 'Administrador' }, { label: 'Gestão de Cargos' }],
    },
    {
      name_key: 'position_create',
      name: 'Novo Cargo',
      path_pattern: '/admin/positions/create',
      is_sub_screen: true,
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Gestão de Cargos', href: '/admin/positions' },
        { label: 'Novo Cargo' },
      ],
    },
    {
      name_key: 'position_edit',
      name: 'Editar Cargo',
      path_pattern: '/admin/positions/[id]',
      is_sub_screen: true,
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Gestão de Cargos', href: '/admin/positions' },
        { label: 'Editar Cargo' },
      ],
    },
    {
      name_key: 'seeu_service',
      name: 'Atendimento SEEU',
      path_pattern: '/seeu-service',
      allowedActions: ['view', 'create', 'edit', 'delete', 'print'],
      breadcrumb: [{ label: 'Atendimento SEEU' }],
    },
    {
      name_key: 'seeu_service_create',
      name: 'Novo Atendimento',
      path_pattern: '/seeu-service/create',
      is_sub_screen: true,
      breadcrumb: [
        { label: 'Atendimento SEEU', href: '/seeu-service' },
        { label: 'Novo Atendimento' },
      ],
    },
    {
      name_key: 'seeu_service_edit',
      name: 'Editar Atendimento',
      path_pattern: '/seeu-service/[id]',
      is_sub_screen: true,
      breadcrumb: [
        { label: 'Atendimento SEEU', href: '/seeu-service' },
        { label: 'Editar Atendimento' },
      ],
    },
    {
      name_key: 'screens_manage',
      name: 'Gerenciamento de Telas',
      path_pattern: '/admin/screens',
      allowedActions: ['view', 'edit'],
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Gerenciamento de Telas' },
      ],
    },
    {
      name_key: 'permissions_manage',
      name: 'Gerenciamento de Permissões',
      path_pattern: '/admin/permissions',
      allowedActions: ['view', 'edit'],
      breadcrumb: [
        { label: 'Administrador' },
        { label: 'Gerenciamento de Permissões' },
      ],
    },
    {
      name_key: 'audit_logs',
      name: 'Logs de Auditoria',
      path_pattern: '/admin/logs',
      allowedActions: ['view'],
      breadcrumb: [{ label: 'Administrador' }, { label: 'Logs de Auditoria' }],
    },
  ];

  // 3. Departments & Positions
  const adminDept = await prisma.department.upsert({
    where: { name: 'Administração' },
    update: {},
    create: { name: 'Administração' },
  });

  const adminPos = await prisma.position.upsert({
    where: { id: 1 },
    update: { name: 'Administrador', department_id: adminDept.id },
    create: {
      id: 1,
      name: 'Administrador',
      department_id: adminDept.id,
    },
  });

  // 4. Admin User
  await prisma.profile.upsert({
    where: { id: 'w1j7UwRA9MVUgkqfOk3exTmSOLi1' },
    update: { position_id: adminPos.id },
    create: {
      id: 'w1j7UwRA9MVUgkqfOk3exTmSOLi1',
      name: 'Arthur Corrêa',
      email: 'arthur@example.com',
      position_id: adminPos.id,
    },
  });

  // 5. Apply Screens and Accesses
  for (const config of screenConfigs) {
    const screen = await prisma.screen.upsert({
      where: { name_key: config.name_key },
      update: {
        name: config.name,
        path_pattern: config.path_pattern,
        breadcrumb: config.breadcrumb as unknown as string,
        is_sub_screen: config.is_sub_screen || false,
      },
      create: {
        name: config.name,
        name_key: config.name_key,
        path_pattern: config.path_pattern,
        breadcrumb: config.breadcrumb as unknown as string,
        is_sub_screen: config.is_sub_screen || false,
      },
    });
    if (config.is_sub_screen) continue;

    for (const pKey of config.allowedActions || []) {
      const permission = dbPermissions[pKey];
      if (!permission) continue;

      // Check for existing access first to avoid unique constraint issues if any
      const existingAccess = await prisma.access.findFirst({
        where: {
          position_id: adminPos.id,
          screen_id: screen.id,
          permission_id: permission.id,
        },
      });

      if (!existingAccess) {
        await prisma.access.create({
          data: {
            position_id: adminPos.id,
            screen_id: screen.id,
            permission_id: permission.id,
            scope: 'all',
          },
        });
      } else if (existingAccess.scope !== 'all') {
        await prisma.access.update({
          where: { id: existingAccess.id },
          data: { scope: 'all' },
        });
      }
    }
  }

  console.log('Seed completed successfully.');
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
