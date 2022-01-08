import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Item } from 'typeorm/entities/items/Item';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const itemRepository = getRepository(Item);
  try {
    const items = await itemRepository.find({});
    res.customSuccess(200, 'List of items.', items);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of items.`, null, err);
    return next(customError);
  }
};
