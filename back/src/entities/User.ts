import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column({type: "varchar", length: 2})
    lastName: string

    @Column()
    accessToken: string

    @Column()
    vk_id: number

    @Column()
    banned: boolean
}