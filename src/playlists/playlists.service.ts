import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(playlistDto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = playlistDto.name;
    playlist.user = await this.userRepository.findOneBy({
      id: playlistDto.user,
    });
    playlist.songs = await this.songRepository.findBy({
      id: In(playlistDto.songs),
    });
    return this.playlistRepository.save(playlist);
  }
}
