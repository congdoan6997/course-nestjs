import {
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
  Body,
  ParseIntPipe,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './song.entity';
import { UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSongDto);
  }

  @Get()
  fillAll(): Promise<Song[]> {
    return this.songsService.fillAll();
  }

  @Get(':id')
  fillOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.fillOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songsService.remove(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDto);
  }
}
