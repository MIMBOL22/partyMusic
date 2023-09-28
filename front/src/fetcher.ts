import {Fetcher} from "swr"
import {IAPISongList} from "./interfaces/IAPISongList"

export const fetchWithToken: Fetcher<IAPISongList, string> = ([url, token]) => fetch(url, {
    headers: {
        "Authorization": "Bearer " + token
    }
}).then(r => r.json())

