import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Item, Categories } from 'typeorm/entities/items/Item';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const skuToEdit = req.params.sku;
  const { sku, category, name, quantity } = req.body;

  const itemRepository = getRepository(Item);
  try {
    const item = await itemRepository.findOne({ where: { sku: skuToEdit } });

    if (!item) {
      const customError = new CustomError(404, 'General', `Item with sku:${skuToEdit} not found.`, ['Item not found.']);
      return next(customError);
    }

    item.sku = sku;
    item.name = name;
    item.category = category as Categories;
    item.quantity = Number(quantity);

    try {
      await itemRepository.save(item);
      res.customSuccess(200, 'Item successfully edited.');
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `Item '${item.sku}' can't be saved.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
