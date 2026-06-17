import { prisma } from "$/prisma/index.js";

const isBlocked = async (userA: string, userB: string) => {
  const block = await prisma.userBlock.findFirst({
    where: {
      OR: [
        { blockerId: userA, blockedId: userB },
        { blockerId: userB, blockedId: userA },
      ],
    },
  });

  return Boolean(block);
};
export default isBlocked;
