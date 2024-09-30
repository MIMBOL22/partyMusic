import {Fetcher} from "swr"
import {IAPISongList} from "./interfaces/IAPISongList"
import {IAPISongListId} from "./interfaces/IAPISongListId"


export const fetchWithToken =  async <T = any>([url, token]: string[]) => {
    const r = await fetch(url, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    const res : T = await r.json();
    return res;
}

export const musicListFetcher: Fetcher<IAPISongList, string[]> = (arg) => fetchWithToken(arg)
export const likedListFetcher: Fetcher<IAPISongListId, string[]> = (arg) => fetchWithToken(arg)

