import { ISong } from "./ISong";

export interface IAPISongList {
    success: boolean,
    result: ISong[];
}