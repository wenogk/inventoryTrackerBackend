import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

import { Categories } from '../../../typeorm/entities/items/Item';

export const validatorEditItem = (req: Request, res: Response, next: NextFunction) => {
  let { name, sku, category, inventory } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  name = !name ? '' : name;
  sku = !sku ? '' : sku;
  category = !category ? '' : category;
  inventory = !inventory ? '' : inventory;
  inventory = String(inventory);

  if (!validator.isEmpty(name) && !validator.isLength(name, { min: 3, max: 25 })) {
    errorsValidation.push({ name: 'Name is invalid' });
  }

  if (
    !validator.isEmpty(sku) &&
    (sku.indexOf(' ') >= 0 || !validator.isAlphanumeric(sku) || !validator.isLength(sku, { min: 4, max: 25 }))
  ) {
    errorsValidation.push({ sku: 'Sku field is invalid' });
  }

  if (!validator.isEmpty(inventory) && !validator.isNumeric(inventory)) {
    errorsValidation.push({ inventory: 'Inventory field is invalid (numeric required)' });
  }

  const possibleCategories = Object.values(Categories);
  if (!validator.isEmpty(category) && !possibleCategories.includes(category)) {
    errorsValidation.push({ category: `Category field is invalid. [${possibleCategories}]` });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Item creation validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  return next();
};
