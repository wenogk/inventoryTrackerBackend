import { Request, Response, NextFunction } from 'express';
import { json2csv } from 'json-2-csv';
import { getRepository } from 'typeorm';

import { Item } from 'typeorm/entities/items/Item';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const generateCsv = async (req: Request, res: Response, next: NextFunction) => {
  const itemRepository = getRepository(Item);
  try {
    const items = await itemRepository.find({
      order: {
        id: 'DESC',
      },
    });
    const fields = ['id', 'sku', 'name', 'category', 'quantity', 'created_at', 'updated_at'];
    json2csv(items, (err, csv) => {
      if (!err) {
        const timestamp = String(new Date().getTime());
        res.attachment(`inventory-${timestamp}.csv`).send(csv);
      } else {
        const customError = new CustomError(400, 'Raw', `Can't convert json to csv.`);
        return next(customError);
      }
    });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of items.`, null, err);
    return next(customError);
  }
};
