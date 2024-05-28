import { Playlist } from 'src/playlists/playlist.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];
}
