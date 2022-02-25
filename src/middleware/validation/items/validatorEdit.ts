import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

import { Categories } from '../../../typeorm/entities/items/Item';

export const validatorEditItemFromReqBody = (body: any) => {
  let { name, sku, category, quantity } = body;
  const errorsValidation: ErrorValidation[] = [];

  name = !name ? '' : name;
  sku = !sku ? '' : sku;
  category = !category ? '' : category;
  quantity = !quantity ? '' : quantity;
  quantity = String(quantity);

  if (!validator.isEmpty(name) && !validator.isLength(name, { min: 3, max: 25 })) {
    errorsValidation.push({ name: 'Name is invalid (length [3,25])' });
  }

  if (
    !validator.isEmpty(sku) &&
    (sku.indexOf(' ') >= 0 || !validator.isAlphanumeric(sku) || !validator.isLength(sku, { min: 4, max: 25 }))
  ) {
    errorsValidation.push({ sku: 'Sku field is invalid (alphanumeric with no spaces and length [4,25])' });
  }

  if (!validator.isEmpty(quantity) && (!validator.isNumeric(quantity) || quantity < 0)) {
    errorsValidation.push({ quantity: 'Quantity field is invalid (positive number required)' });
  }

  const possibleCategories = Object.values(Categories);
  if (!validator.isEmpty(category) && !possibleCategories.includes(category)) {
    errorsValidation.push({ category: `Category field is invalid. [${possibleCategories}]` });
  }

  return errorsValidation;
};

export const validatorEditItem = (req: Request, res: Response, next: NextFunction) => {
  const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(req.body);

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
