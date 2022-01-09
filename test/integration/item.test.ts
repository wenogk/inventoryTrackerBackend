import 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSubset from 'chai-subset';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository, getConnection } from 'typeorm';

import { app } from '../../src/index';
import { dbCreateConnection } from '../../src/typeorm/dbCreateConnection';
import { Item, Categories } from '../../src/typeorm/entities/items/Item';

const SERVER_URL = 'http://localhost:4000';
const should = chai.should();
chai.use(chaiHttp);
chai.use(chaiSubset);

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
        sku: 'SK098648',
        category: 'EDUCATION',
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
  });
});

function containsPartialObj(arr, obj) {
  return arr.some((entry) => {
    const keys = Object.keys(obj);
    return keys.every((key) => obj[key] === entry[key]);
  });
}
