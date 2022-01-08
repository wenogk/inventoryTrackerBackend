import { Router } from 'express';

import auth from './auth';
import items from './items';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/items', items);

export default router;
