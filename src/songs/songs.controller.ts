import {
  Controller,
  Post,
  Get,
  Body,
  ParseIntPipe,
  Param,
  Delete,
  Put,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './song.entity';
import { UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import { JwtArtistGuard } from 'src/auth/jwt-artist.guard';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSongDto);
  }

  @Get()
  fillAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({
      page,
      limit,
    });
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
