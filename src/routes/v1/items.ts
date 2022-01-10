import { Router } from 'express';

import { list, create, edit, deleteItem, generateCsv } from 'controllers/items';
import { validatorCreateItem, validatorEditItem } from 'middleware/validation/items';
const router = Router();

router.get('/', list);
router.post('/', [validatorCreateItem], create);
router.put('/:sku', [validatorEditItem], edit);
router.delete('/:sku', deleteItem);
router.get('/generateCsv', generateCsv);

export default router;
