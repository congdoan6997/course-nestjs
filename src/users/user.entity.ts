import { Playlist } from 'src/playlists/playlist.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    example: 'John',
    description: 'Provide the user first name',
  })
  @Column()
  firstName: string;
  @ApiProperty({
    example: 'Doe',
    description: 'Provide the user last name',
  })
  @Column()
  lastName: string;
  @ApiProperty({
    example: 'joe@gmail.com',
    description: 'Provide the user email',
  })
  @Column({ unique: true })
  email: string;
  @ApiProperty({
    example: 'test123#@',
    description: 'Provide the user password',
  })
  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column()
  apiKey: string;

  @Column({ default: null, type: 'text' })
  phone: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];
}
