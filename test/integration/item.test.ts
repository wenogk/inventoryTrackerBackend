import 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../src/index';
import { dbCreateConnection } from '../../src/typeorm/dbCreateConnection';
import { Item } from '../../src/typeorm/entities/items/Item';

const SERVER_URL = 'http://localhost:4000';
const should = chai.should();
chai.use(chaiHttp);

describe('Items API', () => {
  let dbConnection: Connection;
  let itemRepository: Repository<Item>;
  const newItem = new Item();
  newItem.sku = 'DRF325';
  newItem.name = 'Dog food';

  before(async () => {
    dbConnection = await dbCreateConnection('test');
    itemRepository = getRepository(Item, 'test');
  });

  after(async () => {
    await dbConnection.close();
  });

  beforeEach(async () => {
    await itemRepository.save([newItem]);
  });

  afterEach(async () => {
    await itemRepository.delete([newItem.id]);
  });

  describe('GET /v1/items', () => {
    it('should get all items', async () => {
      const res = await chai.request(SERVER_URL).get('/v1/items');

      console.log(`res.body.message : ${JSON.stringify(res)}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('List of items.');
    });
  });
});
