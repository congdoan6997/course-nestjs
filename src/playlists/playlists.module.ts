import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsController } from './playlists.controller';
import { Playlist } from './playlist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';

@Module({
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
})
export class PlaylistsModule {}
