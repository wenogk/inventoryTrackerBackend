import 'mocha';
import { expect } from 'chai';

import { validatorCreateItemFromReqBody } from '../../src/middleware/validation/items';
import { Categories } from '../../src/typeorm/entities/items/Item';
import { ErrorValidation } from '../../src/utils/response/custom-error/types';

describe('Validator for Create Item Validation middleware', () => {
  describe('Create Items Validator', () => {
    it('should not have any errors if all fields are acceptable', async () => {
      const body = {
        name: 'Eraser',
        sku: 'SK13434',
        category: 'EDUCATION',
        quantity: '5',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(0);
    });

    it('should have an error for category if it is not a valid category', async () => {
      const body = {
        name: 'Eraser',
        sku: 'SK13434',
        category: 'RANDOM_CATEGORY',
        quantity: '5',
      };
      const possibleCategories = Object.values(Categories);
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { category: `Category field is invalid. [${possibleCategories}]` },
      ]);
    });

    it('should have an error when quantity is not numeric', async () => {
      const body = {
        name: 'Eraser',
        sku: 'SK13434',
        category: 'EDUCATION',
        quantity: 'blabla',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { quantity: 'Quantity field is invalid (positive number required)' },
      ]);
    });

    it('should have an error when quantity is negative', async () => {
      const body = {
        name: 'Eraser',
        sku: 'SK13434',
        category: 'EDUCATION',
        quantity: '-5',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { quantity: 'Quantity field is invalid (positive number required)' },
      ]);
    });

    it('should have an error when quantity is not in body', async () => {
      const body = {
        name: 'Eraser',
        sku: 'SK13434',
        category: 'EDUCATION',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { quantity: 'Quantity field is invalid (positive number required)' },
      ]);
    });

    it('should have an error when name is not in body', async () => {
      const body = {
        sku: 'SK13434',
        category: 'EDUCATION',
        quantity: '5',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([{ name: 'Name is invalid (length [3,25])' }]);
    });

    it('should have an error when sku is not in body', async () => {
      const body = {
        name: 'Eraser',
        category: 'EDUCATION',
        quantity: '5',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { sku: 'Sku field is invalid (alphanumeric with no spaces and length [4,25])' },
      ]);
    });

    it('should have an error when category is not in body', async () => {
      const body = {
        name: 'Eraser',
        sku: 'SK13434',
        quantity: '5',
      };
      const possibleCategories = Object.values(Categories);
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { category: `Category field is invalid. [${possibleCategories}]` },
      ]);
    });

    it('should have an error when sku length is less than 4', async () => {
      const body = {
        sku: 'SK1',
        name: 'Eraser',
        category: 'EDUCATION',
        quantity: '5',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { sku: 'Sku field is invalid (alphanumeric with no spaces and length [4,25])' },
      ]);
    });

    it('should not an error when sku length is exactly 4', async () => {
      const body = {
        sku: 'SK12',
        name: 'Eraser',
        category: 'EDUCATION',
        quantity: '5',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(0);
    });

    it('should have an error when sku length is greater than 25', async () => {
      const body = {
        sku: 'SK12345678901234567890123456789',
        name: 'Eraser',
        category: 'EDUCATION',
        quantity: '5',
      };
      const errorsValidation: ErrorValidation[] = validatorCreateItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { sku: 'Sku field is invalid (alphanumeric with no spaces and length [4,25])' },
      ]);
    });
  });
});
