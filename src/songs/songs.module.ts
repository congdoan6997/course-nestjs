import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';

@Module({
  providers: [SongsService],
  controllers: [SongsController],
  imports: [TypeOrmModule.forFeature([Song])],
})
export class SongsModule {}
