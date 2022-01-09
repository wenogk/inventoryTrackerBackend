import { Router } from 'express';

import { list, create, edit, deleteItem } from 'controllers/items';

const router = Router();

router.get('/', list);
router.post('/', create);
router.put('/:sku', edit);
router.delete('/:sku', deleteItem);

export default router;
