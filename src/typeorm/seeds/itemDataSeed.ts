import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { Item, Categories } from '../entities/items/Item';

export class SeedItems1590519635401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let item = new Item();
    const itemRepository = getRepository(Item);

    item.name = 'Headphones';
    item.sku = 'SK2058';
    item.category = Categories.TECHNOLOGY;
    item.quantity = 25;
    await itemRepository.save(item);

    item.name = 'Smart Phone';
    item.sku = 'SK9384';
    item.category = Categories.TECHNOLOGY;
    item.quantity = 34;
    await itemRepository.save(item);

    item = new Item();
    item.name = 'Strawberry Milk';
    item.sku = 'Sk2104';
    item.category = Categories.KITCHEN;
    item.quantity = 465;
    await itemRepository.save(item);

    item = new Item();
    item.name = 'Pet collar';
    item.sku = 'SK8237';
    item.category = Categories.PET;
    item.quantity = 12;
    await itemRepository.save(item);

    item = new Item();
    item.name = 'Design Patterns Book';
    item.sku = 'SK9238';
    item.category = Categories.EDUCATION;
    item.quantity = 1230;
    await itemRepository.save(item);

    item = new Item();
    item.name = 'Gaming Chair';
    item.sku = 'SK8775';
    item.category = Categories.HOME;
    item.quantity = 5;
    await itemRepository.save(item);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}
