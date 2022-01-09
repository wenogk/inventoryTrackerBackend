import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Item } from 'typeorm/entities/items/Item';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  const sku = req.params.sku;

  const itemRepository = getRepository(Item);
  try {
    const item = await itemRepository.findOne({ where: { sku } });

    if (!item) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Item with sku:${sku} doesn't exist.`]);
      return next(customError);
    }
    itemRepository.delete({ sku: sku });

    res.customSuccess(200, 'Item successfully deleted.', item);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
