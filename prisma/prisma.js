const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
// npm i - g prisma @latest                               │
// npm i @prisma/client@latest