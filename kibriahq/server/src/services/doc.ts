import { prisma } from "../lib/prisma.js";
import error from "../utils/error.js";

const toUserId = (userId?: string | number) => {
    const id = Number(userId);
    return Number.isNaN(id) ? undefined : id;
}

const mapDoc = (doc: any) => doc && ({
    ...doc,
    user_id: doc.userId,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
});

const mapUser = (user: any) => user && ({
    ...user,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
});

const mapPermissionUser = (permission: any) => ({
    id: permission.id,
    user_id: permission.user.id,
    name: permission.user.name,
    email: permission.user.email,
    role: permission.role,
    color: permission.user.color,
});

export const getDocsByUser = async (userId: string) => {
    const docs = await prisma.doc.findMany({
        where: { userId: Number(userId) },
    });

    return docs.map(mapDoc);
}

export const getDocsByPermission = async (userId: string) => {
    const permissions = await prisma.docPermission.findMany({
        where: { userId: Number(userId) },
        include: {
            doc: true,
            user: {
                select: { id: true },
            },
        },
    } as any) as any[];

    return permissions.map((permission) => ({
        id: permission.doc.id,
        name: permission.doc.name,
        body: permission.doc.body,
        created_at: permission.doc.createdAt,
        updated_at: permission.doc.updatedAt,
        role: permission.role,
        user_id: permission.user.id,
    }));
}

export const createDoc = async (name: string, body?: string, userId?: string | number) => {
    const data: any = {
        name: name ?? 'New Document',
        body: body === undefined ? null : Buffer.from(body),
    };
    const parsedUserId = toUserId(userId);
    if (parsedUserId !== undefined) {
        data.userId = parsedUserId;
    }

    const doc = await prisma.doc.create({
        data,
    });

    return mapDoc(doc);
}

export const updateDoc = async (id: string, name?: string, userId?: string) => {
    const doc = await prisma.doc.findUnique({
        where: { id },
    });

    if (doc?.userId != toUserId(userId)) {
        throw error('You do not have permission to update this document')
    }

    const updatedDoc = await prisma.doc.update({
        where: { id },
        data: { name: name ?? '' },
    });

    return mapDoc(updatedDoc);
}

export const getDocById = async (id: string, userId: string) => {
    try {
        const doc = await prisma.doc.findUnique({
            where: { id },
        });

        if (!doc) {
            throw error('Document not found', 404);
        }

        const permissions = await prisma.docPermission.findMany({
            where: { docId: id },
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

        const author = doc.userId
            ? await prisma.user.findUnique({ where: { id: doc.userId } })
            : null;
        
        return {
            ...mapDoc(doc),
            permissions: permissions.map(mapPermissionUser),
            author: mapUser(author),
            isAuthor: doc.userId == toUserId(userId),
        };
    } catch (err: any) {
        throw error(err.message, 404)
    }
}

export const deleteDocById = async (id: string, userId: string) => {
    const doc = await prisma.doc.findUnique({
        where: { id },
    });

    if (doc?.userId != toUserId(userId)) {
        throw error('You do not have permission to delete this document')
    }

    await prisma.doc.delete({
        where: { id },
    });
}