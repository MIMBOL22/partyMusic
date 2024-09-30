import {IBannedAuthor} from "./IBannedAuthor";

export interface IAPIBannedAuthor {
    success: boolean,
    result: IBannedAuthor[];
}
