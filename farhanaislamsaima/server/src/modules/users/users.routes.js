import express from 'express';
import { getUsers } from './users.controller.js';

const router = express.Router();

router.get('/', getUsers);

export default router;
