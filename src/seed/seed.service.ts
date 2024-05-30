import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedData } from 'db/seeds/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner(); //1
    await queryRunner.connect(); //2

    await queryRunner.startTransaction(); //3
    try {
      const manager = queryRunner.manager; //4
      await seedData(manager); //5
      await queryRunner.commitTransaction(); //6
    } catch (error) {
      console.log('Error during transaction: ', error);
      await queryRunner.rollbackTransaction(); //7
    } finally {
      await queryRunner.release(); //8
    }
  }
}
