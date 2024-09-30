import "./SongList.css"
import useSWR, {useSWRConfig} from "swr"
import useLocalStorage from "use-local-storage";
import {fetchWithToken} from "../fetcher";
import {useJwt} from "react-jwt";
import {IJWTUser} from "../interfaces/IJWTUser";
import {toast} from "react-toastify";
import {IAPISongList} from "../interfaces/IAPISongList";
import {Alert, Table} from "react-bootstrap";
import { IAPISongListId } from "../interfaces/IAPISongListId";
import {likedListFetcher, musicListFetcher} from "../fetcher";
import React from "react";
import {AuthorsWarning} from "./AuthorsWarning";
import {UNIX_EXPIRED} from "./NewSong";

export const SongList = () => {
    const {mutate} = useSWRConfig()
    const [jwt, setJwt] = useLocalStorage('jwt', "");
    const {decodedToken, isExpired} = useJwt<IJWTUser>(jwt);
    const isLogged = !isExpired && jwt !== "";

    const songList = useSWR(['/api/song/list', jwt], musicListFetcher);
    const likedList = useSWR(['/api/user/likes', jwt], likedListFetcher);
    const dislikedList = useSWR(['/api/user/dislikes', jwt], likedListFetcher);

    if (songList.error || songList.data?.success !== true) return <div>Ошибка загрузки списка песен</div>
    if (likedList.error || likedList.data?.success !== true && isLogged) return <div>Ошибка загрузки списка лайков</div>
    if (dislikedList.isLoading || dislikedList.data?.success !== true &&  isLogged) return <div>Ошибка загрузки списка дизлайков</div>

    if (songList.isLoading) return <div>Загрузка песен...</div>
    if (likedList.isLoading) return <div>Загрузка лайков...</div>
    if (dislikedList.isLoading) return <div>Загрузка дизлайков</div>


    const isTimeExpired = UNIX_EXPIRED  <= Date.now();

    const userBan = (user_id: number | undefined) => {
        if (user_id == undefined) return;

        fetch("/api/user/ban", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwt
            },
            body: JSON.stringify({user_id})
        })
            .then(response => response.json())
            .then(result => {
                if (result.success !== true) {
                    console.error("UserBan songList.error:", result);
                    toast.error("Неизвестная ошибка");
                } else {
                    toast.success("Пользователь заблокирован");
                    mutate(['/api/song/list', jwt]);
                }
            })
            .catch(e => console.log('user/ban error', e))
    }

    const likeTrack = (song_id: number) =>{
        if (!isLogged) return toast.info("Для этого нужно войти")
        if (isTimeExpired) return toast.info("Время истекло")

        fetch("/api/song/like", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwt
            },
            body: JSON.stringify({song_id})
        })
            .then(response => response.json())
            .then(result => {
                if (result.success !== true) {
                    console.error("Like song error:", result);
                    toast.error("Неизвестная ошибка");
                } else {
                    toast.success("Успешно");
                    mutate(['/api/user/likes', jwt]);
                    mutate(['/api/user/dislikes', jwt]);
                }
            })
            .catch(e => console.log('song/like error', e))
    }

    const dislikeTrack = (song_id: number) =>{
        if (!isLogged) return toast.info("Для этого нужно войти")
        if (isTimeExpired) return toast.info("Время истекло")
        fetch("/api/song/dislike", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwt
            },
            body: JSON.stringify({song_id})
        })
            .then(response => response.json())
            .then(result => {
                if (result.success !== true) {
                    console.error("Dislike song error:", result);
                    toast.error("Неизвестная ошибка");
                } else {
                    toast.success("Успешно");
                    mutate(['/api/user/likes', jwt]);
                    mutate(['/api/user/dislikes', jwt]);
                }
            })
            .catch(e => console.log('song/dislike error', e))
    }

    return (<div className="song_list">
        <AuthorsWarning/>

        <Table responsive>
            <thead>
            <tr>
                <th>Место</th>
                <th>Трек</th>
                <th>ЯМузыка</th>
                <th>Рейтинг</th>
                <th>Действия</th>
                {decodedToken?.group === 1 && <th>Добавил</th>}
            </tr>
            </thead>
            <tbody>
            {
                songList.data?.result.map((s, l) => {
                    const likedIndex = likedList.data?.result?.indexOf(s.id);
                    const dislikedIndex = dislikedList.data?.result?.indexOf(s.id);

                    const isLiked = likedIndex === undefined ? false : likedIndex !== -1;
                    const isDisliked = dislikedIndex === undefined ? false :dislikedIndex !== -1;


                    return (<tr key={s.id} id={"track"+s.id}>
                        <td>{l + 1}</td>
                        <td>{s.author} - {s.name}</td>
                        <td>
                            {s.youtube && <a href={s.youtube} target="_blank">{s.youtube}</a>}
                            {!s.youtube && "Отсутствует"}
                        </td>
                        <td>+{s.likes} / -{s.dislikes}</td>
                        <td>
                            <a
                                href="#"
                                style={{color: "#00ff7f", marginLeft: "1vw", background: isLiked ? "#1f6135" : ""}}
                                onClick={(e) => {
                                    likeTrack(s.id);
                                    e.preventDefault();
                                }}
                            >
                                Лайк
                            </a>


                            <a
                                href="#"
                                style={{color: "red", marginLeft: "1vw", background: isDisliked ? "#c70000" : ""}}
                                onClick={(e) => {
                                    dislikeTrack(s.id);
                                    e.preventDefault();
                                }}
                            >
                                Дизлайк
                            </a>
                        </td>
                        {(decodedToken?.group === 1 && s.adder !== undefined) && <th>
                            <a href={"https://vk.com/id" + s.adder?.vk_id} target="_blank">
                                {s.adder.firstName} {s.adder.lastName}
                            </a>
                            <a
                                href="#"
                                style={{color: "red", marginLeft: "1vw"}}
                                onClick={() => {
                                    userBan(s?.adder?.id)
                                }}
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
