import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerModule } from './common/middleware/logger/logger.module';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { Song } from './songs/song.entity';
import { User } from './users/user.entity';
import { Artist } from './artists/artist.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { Playlist } from './playlists/playlist.entity';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    SongsModule,
    LoggerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'postgres',
      entities: [Song, User, Artist, Playlist],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    ArtistsModule,
    PlaylistsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('dbName', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerModule).forRoutes(SongsController);
  }
}
