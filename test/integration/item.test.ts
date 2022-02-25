import 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { getRepository, Connection, Repository, getConnection } from 'typeorm';

import { dbCreateConnection } from '../../src/typeorm/dbCreateConnection';
import { Item, Categories } from '../../src/typeorm/entities/items/Item';

const SERVER_URL = 'http://localhost:4000';
const should = chai.should();
chai.use(chaiHttp);

describe('Items API', () => {
  let dbConnection: Connection;
  let itemRepository: Repository<Item>;

  const newItem = new Item();
  newItem.sku = 'SK2058';
  newItem.name = 'Dog food';
  newItem.category = Categories.PET;

  const newItem2 = new Item();
  newItem2.sku = 'SK1999';
  newItem2.name = 'Spoon';
  newItem2.category = Categories.KITCHEN;

  const newItem3 = new Item();
  newItem3.sku = 'SK2022';
  newItem3.name = 'Oculus VR Headset';
  newItem3.category = Categories.TECHNOLOGY;

  before(async () => {
    dbConnection = await dbCreateConnection('test');
    itemRepository = getRepository(Item, 'test');
  });

  after(async () => {
    await getConnection('test').close();
  });

  beforeEach(async () => {
    await itemRepository.save([newItem, newItem2, newItem3]);
  });

  afterEach(async () => {
    await itemRepository.delete([newItem.id, newItem2.id, newItem3.id]);
  });

  describe('GET /v1/items', () => {
    it('should get all items', async () => {
      const res = await chai.request(SERVER_URL).get('/v1/items');
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('List of items.');
      expect(res.body.data).to.be.an('array').that.is.not.empty;
      expect(containsPartialObj(res.body.data, { name: newItem.name, sku: newItem.sku })).to.be.true;
      expect(containsPartialObj(res.body.data, { name: newItem2.name, sku: newItem2.sku })).to.be.true;
      expect(containsPartialObj(res.body.data, { name: newItem3.name, sku: newItem3.sku })).to.be.true;
    });
  });

  describe('POST /v1/items', () => {
    it('should create a new item', async () => {
      const newItemObj = {
        name: 'Pencil box',
        sku: 'SK098641',
        category: 'EDUCATION',
        quantity: 25,
      };
      const res = await chai.request(SERVER_URL).post('/v1/items').send(newItemObj);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Item successfully created.');

      const res2 = await chai.request(SERVER_URL).get('/v1/items');
      expect(res2.status).to.equal(200);
      expect(res2.body.message).to.equal('List of items.');
      expect(res2.body.data).to.be.an('array').that.is.not.empty;
      expect(containsPartialObj(res2.body.data, newItemObj)).to.be.true;

      await itemRepository.delete({ sku: newItemObj.sku });
    });

    it('should not create item if sku already exists', async () => {
      const newItemObj = {
        name: 'Pencil box',
        sku: newItem.sku,
        category: 'EDUCATION',
        quantity: 25,
      };
      const res = await chai.request(SERVER_URL).post('/v1/items').send(newItemObj);
      expect(res.status).to.equal(400);
      expect(res.body.errorMessage).to.equal('Item SKU already exists');
    });

    it('should not create item if category invalid', async () => {
      const newItemObj = {
        name: 'Pencil box',
        sku: 'SK9876',
        category: 'RANDOM_CATEGORY',
        quantity: 25,
      };
      const res = await chai.request(SERVER_URL).post('/v1/items').send(newItemObj);
      expect(res.status).to.equal(400);
      expect(res.body.errorMessage).to.equal('Item creation validation error');
    });

    it('should not create item if name length invalid', async () => {
      const newItemObj = {
        name: 'k',
        sku: 'SK9876',
        category: 'GENERAL',
        quantity: 25,
      };
      const res = await chai.request(SERVER_URL).post('/v1/items').send(newItemObj);
      expect(res.status).to.equal(400);
      expect(res.body.errorMessage).to.equal('Item creation validation error');
    });

    it('should not create item if quantity not numeric', async () => {
      const newItemObj = {
        name: 'Table',
        sku: 'SK9876',
        category: 'GENERAL',
        quantity: 'NOT A NUMBER',
      };
      const res = await chai.request(SERVER_URL).post('/v1/items').send(newItemObj);
      expect(res.status).to.equal(400);
      expect(res.body.errorMessage).to.equal('Item creation validation error');
    });

    it('should not create item if quantity is less than zero', async () => {
      const newItemObj = {
        name: 'Table',
        sku: 'SK9876',
        category: 'GENERAL',
        quantity: -99,
      };
      const res = await chai.request(SERVER_URL).post('/v1/items').send(newItemObj);
      expect(res.status).to.equal(400);
      expect(res.body.errorMessage).to.equal('Item creation validation error');
    });
  });

  describe('PUT /v1/items/:sku', () => {
    it('should edit an existing item', async () => {
      const editObj = {
        name: 'Cat Food',
        quantity: 7,
      };
      const res = await chai.request(SERVER_URL).put(`/v1/items/${newItem.sku}`).send(editObj);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Item successfully edited.');

      const res2 = await chai.request(SERVER_URL).get('/v1/items');
      expect(res2.status).to.equal(200);
      expect(res2.body.message).to.equal('List of items.');
      expect(res2.body.data).to.be.an('array').that.is.not.empty;
      expect(containsPartialObj(res2.body.data, { ...editObj, sku: newItem.sku })).to.be.true;
    });

    it('should not be able to edit an item that does not exist', async () => {
      const editObj = {
        name: 'Cat Food',
        quantity: 7,
      };
      const res = await chai.request(SERVER_URL).put(`/v1/items/DOESNOTEXIST1234`).send(editObj);
      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /v1/items/:sku', () => {
    it('should delete an item by sku', async () => {
      const res = await chai.request(SERVER_URL).delete(`/v1/items/${newItem.sku}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Item successfully deleted.');
      expect(res.body.data.sku).to.equal(newItem.sku);

      const res2 = await chai.request(SERVER_URL).get('/v1/items');
      expect(res2.status).to.equal(200);
      expect(res2.body.message).to.equal('List of items.');
      expect(res2.body.data).to.be.an('array').that.is.not.empty;
      expect(containsPartialObj(res2.body.data, { name: newItem.name, sku: newItem.sku })).to.be.false;
    });

    it('should not be able to delete an item whose sku does not exist', async () => {
      const res = await chai.request(SERVER_URL).delete(`/v1/items/DOESNOTEXIST123`);
      expect(res.status).to.equal(404);
    });
  });
});

function containsPartialObj(arr, obj) {
  return arr.some((entry) => {
    const keys = Object.keys(obj);
    return keys.every((key) => obj[key] === entry[key]);
  });
}
