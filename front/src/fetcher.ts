import {Fetcher} from "swr"
import {IAPISongList} from "./interfaces/IAPISongList"
import {IAPISongListId} from "./interfaces/IAPISongListId"


export const fetchWithToken = ([url, token]: string[]) => fetch(url, {
    headers: {
        "Authorization": "Bearer " + token
    }
}).then(r => r.json())

export const musicListFetcher: Fetcher<IAPISongList, string[]> = (arg) => fetchWithToken(arg)
export const likedListFetcher: Fetcher<IAPISongListId, string[]> = (arg) => fetchWithToken(arg)

