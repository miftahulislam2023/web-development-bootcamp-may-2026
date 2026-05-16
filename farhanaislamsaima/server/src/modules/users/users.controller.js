import {
  getCache,
  setCache
} from '../../shared/cache.js';
import { listUsers } from './users.service.js';

async function getUsers(req, res) {
  const cacheKey = 'users:list';
  const cachedUsers = await getCache(cacheKey);

  if (cachedUsers) {
    return res.json(cachedUsers);
  }

  try {
    const users = await listUsers();

    await setCache(cacheKey, users, 60000);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Could not get users' });
  }
}

export {
  getUsers
};
