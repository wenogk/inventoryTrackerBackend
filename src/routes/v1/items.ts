import { Router } from 'express';

import { list, create, edit } from 'controllers/items';

const router = Router();

router.get('/', list);
router.post('/', create);
router.put('/:sku', edit);

export default router;
