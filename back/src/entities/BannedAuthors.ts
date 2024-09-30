import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class BannedAuthors extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "json"})
    author_names: string[]

    @Column()
    official_name: string
}