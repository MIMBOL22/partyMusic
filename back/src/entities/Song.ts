import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import { User } from "./User"

@Entity()
export class Song
    extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    author: string

    @Column({type: "varchar"})
    name: string

    @Column({nullable: true})
    youtube: string

    @ManyToOne(() => User, (user) => user.songs)
    adder: User

    @ManyToMany(() => User, (user) => user.likes)
    @JoinTable()
    likes: User[]


    @ManyToMany(() => User, (user) => user.dislikes)
    @JoinTable()
    dislikes: User[]
}