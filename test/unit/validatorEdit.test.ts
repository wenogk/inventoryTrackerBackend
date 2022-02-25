import 'mocha';
import { expect } from 'chai';

import { validatorEditItemFromReqBody } from '../../src/middleware/validation/items';
import { Categories } from '../../src/typeorm/entities/items/Item';
import { ErrorValidation } from '../../src/utils/response/custom-error/types';

describe('Validator for Edit Item Validation middleware', () => {
  describe('Edit Items Validator', () => {
    it('should not have any errors if just valid name is in the body', async () => {
      const body = {
        name: 'Eraser',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(0);
    });

    it('should not have any errors if just valid sku is in the body', async () => {
      const body = {
        sku: 'SK13434',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(0);
    });

    it('should not have any errors if just valid category is in the body', async () => {
      const body = {
        category: 'EDUCATION',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(0);
    });

    it('should not have any errors if just valid quantity is in the body', async () => {
      const body = {
        quantity: '5',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(0);
    });

    it('should have an error for category if it is not a valid category', async () => {
      const body = {
        category: 'RANDOM_CATEGORY',
        quantity: '5',
      };
      const possibleCategories = Object.values(Categories);
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { category: `Category field is invalid. [${possibleCategories}]` },
      ]);
    });

    it('should have an error when quantity is not numeric', async () => {
      const body = {
        quantity: 'blabla',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { quantity: 'Quantity field is invalid (positive number required)' },
      ]);
    });

    it('should have an error when quantity is negative', async () => {
      const body = {
        quantity: '-5',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { quantity: 'Quantity field is invalid (positive number required)' },
      ]);
    });

    it('should have an error when sku length is less than 4', async () => {
      const body = {
        sku: 'SK1',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { sku: 'Sku field is invalid (alphanumeric with no spaces and length [4,25])' },
      ]);
    });

    it('should not an error when sku length is exactly 4', async () => {
      const body = {
        sku: 'SK12',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(0);
    });

    it('should have an error when sku length is greater than 25', async () => {
      const body = {
        sku: 'SK12345678901234567890123456789',
      };
      const errorsValidation: ErrorValidation[] = validatorEditItemFromReqBody(body);
      expect(errorsValidation.length).to.equal(1);
      expect(errorsValidation).to.have.deep.members([
        { sku: 'Sku field is invalid (alphanumeric with no spaces and length [4,25])' },
      ]);
    });
  });
});
