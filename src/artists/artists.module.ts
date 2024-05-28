import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';

@Module({
  providers: [ArtistsService],
  controllers: [ArtistsController],
  imports: [TypeOrmModule.forFeature([Artist])],
  exports: [ArtistsService],
})
export class ArtistsModule {}
