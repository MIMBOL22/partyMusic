import "./SongList.css"
import useSWR, { useSWRConfig } from "swr"
import useLocalStorage from "use-local-storage";
import {Table} from "react-bootstrap";
import {IAPISongList} from "../interfaces/IAPISongList"
import {fetchWithToken} from "../fetcher";
import {useJwt} from "react-jwt";
import {IJWTUser} from "../interfaces/IJWTUser";
import { toast } from "react-toastify";

export const SongList = () => {
    const { mutate } = useSWRConfig()
    const [jwt, setJwt] = useLocalStorage('jwt', "");
    const {decodedToken} = useJwt<IJWTUser>(jwt);

    const {data: songList, error, isLoading} = useSWR<IAPISongList>(['/api/song/list', jwt], fetchWithToken);
    if (error || songList?.success !== true) return <div>Ошибка загрузки списка песен</div>
    if (isLoading) return <div>Загрузка песен...</div>

    const {data: likedList, error: likedError, isLoading: likedIsLoading } = useSWR<IAPISongList>(['/api/user/likes', jwt], fetchWithToken);
    if (likedIsLoading || likedList?.success !== true) return <div>Ошибка загрузки списка лайков</div>
    if (likedIsLoading) return <div>Загрузка айков...</div>

    const {data: dislikedList, error: dislikedError, isLoading: dislikedIsLoading } = useSWR<IAPISongList>(['/api/user/dislikes', jwt], fetchWithToken);
    if (dislikedIsLoading || dislikedList?.success !== true) return <div>Ошибка загрузки списка дизлайков</div>
    if (dislikedIsLoading) return <div>Загрузка дизлайков</div>



    const userBan = (user_id: number | undefined) => {
        if (user_id == undefined) return;

        fetch("/api/user/ban", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+jwt
            },
            body: JSON.stringify({user_id})
        })
            .then(response => response.json())
            .then(result => {
                if (result.success !== true){
                    console.error("UserBan Error:",result);
                    toast.error("Неизвестная ошибка");
                }else{
                    toast.success("Пользователь заблокирован");
                    mutate(['/api/song/list', jwt]);
                }
            })
            .catch(error => console.log('error', error));
    }

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
                            <a href={"https://vk.com/id" + s.adder?.vk_id} target="_blank">
                                {s.adder.firstName} {s.adder.lastName}
                            </a>
                            <a
                                href="#"
                                style={{color:"red", marginLeft: "1vw"}}
                                onClick={()=>{userBan(s?.adder?.id)}}
                            >
                                БАН
                            </a>
                        </th>}
                    </tr>)
                })
            }
            </tbody>
        </Table>
    </div>)
}
