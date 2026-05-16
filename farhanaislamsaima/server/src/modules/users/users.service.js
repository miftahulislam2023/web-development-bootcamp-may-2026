import prisma from '../../shared/db.js';

async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });
}

export {
  listUsers
};
