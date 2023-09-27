import {BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { Song } from "./Song"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column({type: "varchar", length: 1})
    lastName: string

    @Column()
    accessToken: string

    @Column()
    vk_id: number

    @Column()
    banned: boolean

    @OneToMany(() => Song, (song) => song.adder)
    songs: Song[]

    @ManyToMany(() => Song, (song) => song.likes)
    likes: Song[]

    @ManyToMany(() => Song, (song) => song.dislikes)
    dislikes: Song[]
}