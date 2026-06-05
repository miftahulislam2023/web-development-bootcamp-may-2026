import type { Response } from "express"
import { createDoc, getDocsByUser, getDocsByPermission, updateDoc, getDocById, deleteDocById } from "../services/doc.js";
import type { AuthRequest } from "../middlewares/auth.js";
import error from "../utils/error.js";

export const myDocs = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const docs = await getDocsByUser(userId.toString());
        return res.status(200).json(docs);
    } catch (err: any) {
        throw error(err.message, 500);
    }
}

export const sharedDocs = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const docs = await getDocsByPermission(userId.toString());
    return res.status(200).json(docs);
}

export const create = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const name = req.body.name || 'New Document';

        const doc = await createDoc(name, '', userId);

        return res.status(201).json(doc);
    } catch (err: any) {
        throw error(err.message, 500);
    }
}

export const updateName = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user!.id;
    const doc = await updateDoc(id as string, name, userId.toString());
    return res.status(200).json(doc);
}

export const getDoc = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const doc = await getDocById(id as string, userId.toString());
    if (!doc) {
        return res.status(404).json({ message: 'Document not found' });
    }

    if (doc.user_id === userId) {
        return res.status(200).json(doc);
    }

    let isPermission = false;

    doc.permissions.forEach((perm: { user_id: string | number }) => {
        if (perm.user_id === userId) {
            isPermission = true;
        }
    });

    if (isPermission) {
        return res.status(200).json(doc);
    }

    throw error('You do not have permission to access this document', 403)
}

export const deleteDoc = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const doc = await deleteDocById(id as string, userId.toString());
    return res.status(200).json(doc);
}