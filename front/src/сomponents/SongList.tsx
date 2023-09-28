import "./SongList.css"
import useSWR from "swr"
import useLocalStorage from "use-local-storage";
import {Table} from "react-bootstrap";
import {IAPISongList} from "../interfaces/IAPISongList"
import {fetchWithToken} from "../fetcher";
import { useJwt } from "react-jwt";
import { IJWTUser } from "../interfaces/IJWTUser";

export const SongList = () => {
    const [jwt, setJwt] = useLocalStorage('jwt', "");
    const {decodedToken} = useJwt<IJWTUser>(jwt);

    const {data: songList, error, isLoading} = useSWR<IAPISongList>(['/api/song/list', jwt], fetchWithToken);
    if (error || songList?.success !== true) return <div>Ошибка загрузки списка песен</div>
    if (isLoading) return <div>Загрузка песен...</div>

    //
    // const { data, error, isLoading } = useSWR<IAPISongList>(['/api/user', jwt], fetchWithToken);


    return (<div className="song_list">
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Место</th>
                <th>Трек</th>
                <th>YouTube</th>
                <th>Действия</th>
                {decodedToken?.group === 1 && <th>Добавил</th>}
            </tr>
            </thead>
            <tbody>
            {
                songList?.result.map((s, l) => {
                    return (<tr key={s.id}>
                        <td>{l + 1}</td>
                        <td>{s.author} - {s.name}</td>
                        <td>{s.youtube ? s.youtube : "Отсутствует"}</td>
                        <td>Отсутствуют</td>
                        {(decodedToken?.group === 1 && s.adder !== undefined) && <th>
                                    <a href={"https://vk.com/id"+s.adder?.vk_id} target="_blank">
                                        {s.adder.firstName} {s.adder.lastName}
                                    </a>
                                </th>}
                    </tr>)
                })
            }

            </tbody>
        </Table>
    </div>)
}
