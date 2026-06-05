import type { Request, Response } from 'express';
import { searchUser, addDocPermission, removeDocPermission, getDocPermissions } from "../services/permission.js";
import error from '../utils/error.js';

export const userSearch = async (req: Request, res: Response) => {
    try {
        const { search, docId } = req.body;
        const users = await searchUser(search, docId);
        res.json(users);
    } catch (err: any) {
        throw error(err.message, err.statusCode || 500)
    }
}

export const addPermission = async (req: Request, res: Response) => {
    try {
        const { docId, userId } = req.body;
        const permission = await addDocPermission(docId, userId);
        res.json(permission);
    } catch (err: any) {
        throw error(err.message, err.statusCode || 500)
    }
}

export const removePermission = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const permission = await removeDocPermission(id);
        res.json(permission);
   } catch (err: any) {
        throw error(err.message, err.statusCode || 500)
    }
}

export const getPermissionsByDocId = async (req: Request, res: Response) => {
    try {
        const { docId } = req.params;
        const permissions = await getDocPermissions(docId as string);
        res.json(permissions);
    } catch (err: any) {
        throw error(err.message, err.statusCode || 500)
    }
}