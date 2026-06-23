import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { categoryRoutes } from '../modules/category/category.route';
import { transactionRoutes } from '../modules/transaction/transaction.route';
import { recurrenceRoutes } from '../modules/recurrence/recurrence.route';

export const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/transactions',
    route: transactionRoutes,
  },
  {
    path: '/recurrences',
    route: recurrenceRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
