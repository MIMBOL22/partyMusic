import {DataSource} from "typeorm";
import { Song } from "./entities/Song";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres",
    port: Number(process.env.POSTGRES_PORT || 5432) ,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: true,
    entities: [Song, User],
    subscribers: [],
    migrations: [],
})
