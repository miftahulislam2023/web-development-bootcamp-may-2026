import { prisma } from "../lib/prisma.js";

const toUserId = (userId: string | number) => {
    const id = Number(userId);
    return Number.isNaN(id) ? undefined : id;
}

const mapPermission = (permission: any) => permission && ({
    ...permission,
    doc_id: permission.docId,
    user_id: permission.userId,
    created_at: permission.createdAt,
    updated_at: permission.updatedAt,
});

const mapPermissionUser = (permission: any) => ({
    id: permission.id,
    user_id: permission.user.id,
    name: permission.user.name,
    email: permission.user.email,
    role: permission.role,
    color: permission.user.color,
});

export const searchUser = async (search: string, docId: string) => {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: search } },
                { email: { contains: search } },
            ],
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    const permissions = await prisma.docPermission.findMany({
        where: { docId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    color: true,
                },
            },
        },
    } as any) as any[];

    const doc = await prisma.doc.findUnique({
        where: { id: docId },
    });

    const filterUser = users.filter((user) => user.id !== doc?.userId);

    const usersWithPermission = filterUser.map((user) => {
        const u: any = { ...user, isAdded: false, permission: null };
        permissions.forEach((permission) => {
            if (permission.userId === user.id) {
                u.isAdded = true;
                u.permission = mapPermissionUser(permission);
            }
        });
        return u;
    });


    return usersWithPermission;
}

export const addDocPermission = async (docId: string, userId: string, role?: string) => {
    const permission = await prisma.docPermission.create({
        data: {
            docId,
            userId: toUserId(userId)!,
            role: (role || 'edit') as any,
        },
    });

    return mapPermission(permission);
}

export const removeDocPermission = async (id: string) => {
    const permission = await prisma.docPermission.delete({
        where: { id: Number(id) },
    });

    return mapPermission(permission);
}

export const updateDocPermission = async (docId: string, userId: string, role: string) => {
    const permission = await prisma.docPermission.update({
        where: {
            docId_userId: {
                docId,
                userId: toUserId(userId)!,
            },
        },
        data: {
            role: role as any,
        },
    });

    return mapPermission(permission);
}

export const getDocPermissions = async (docId: string) => {
    const permissions = await prisma.docPermission.findMany({
        where: { docId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    color: true,
                },
            },
        },
    } as any) as any[];

    return permissions.map(mapPermissionUser);
}

export const getDocPermission = async (docId: string, userId: string) => {
    const permission = await prisma.docPermission.findUnique({
        where: {
            docId_userId: {
                docId,
                userId: toUserId(userId)!,
            },
        },
    });
    console.log(permission);
    
    return mapPermission(permission);
}
