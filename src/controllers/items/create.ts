import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Item, Categories } from 'typeorm/entities/items/Item';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { sku, name, category } = req.body;

  const itemRepository = getRepository(Item);
  try {
    const item = await itemRepository.findOne({ where: { sku } });

    if (item) {
      const customError = new CustomError(400, 'General', 'Item SKU already exists', [
        `Item SKU  '${item.sku}' already exists`,
      ]);
      return next(customError);
    }

    try {
      const newItem = new Item();
      newItem.sku = sku;
      newItem.category = Categories.GENERAL;
      newItem.name = name;
      await itemRepository.save(newItem);

      res.customSuccess(200, 'Item successfully created.');
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `Item '${sku}' can't be created`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
