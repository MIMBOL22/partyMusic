import React, {useState} from "react";
import {Alert, Badge, Button, Form, InputGroup, Modal} from "react-bootstrap";
import { useJwt } from "react-jwt";
import { toast } from "react-toastify";
import useLocalStorage from "use-local-storage";
import { IJWTUser } from "../interfaces/IJWTUser";
import "./NewSong.css"
import useSWR, { useSWRConfig } from "swr";
import {AuthorsWarning} from "./AuthorsWarning";
import {IAPIBannedAuthor} from "../interfaces/IAPIBannedAuthor";
import {fetchWithToken} from "../fetcher";
import {IAPIUserSongs} from "../interfaces/IAPIUserSongs";
import {TimerBadge} from "./TimerBadge";

export const UNIX_EXPIRED = 1728154740000;

export const NewSong = () => {

    const [jwt, setJwt] = useLocalStorage('jwt', "");
    const {decodedToken, isExpired} = useJwt<IJWTUser>(jwt);
    const isLogged = !isExpired && jwt !== "";

    const { mutate } = useSWRConfig()

    const [trackName, setTrackName] = useState("");
    const [trackAuthor, setTrackAuthor] = useState("");
    const [trackURL, setTrackURL] = useState("");

    // @ts-ignore
    const {data: bannedAuthors, error, isLoading} = useSWR<IAPIBannedAuthor>(["/api/authors/banned", jwt], fetchWithToken);
    // @ts-ignore
    const userSongsCount = useSWR<IAPIUserSongs>(["/api/user/songs", jwt], fetchWithToken);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addSong = () => {
        if (!isLogged) return toast.info("Для этого нужно войти");
        if (decodedToken?.banned) return toast.error("Вы заблокированы");
        handleShow();
    }

    let isAuthorBanned = false;
    if(!error && !isLoading && bannedAuthors && bannedAuthors?.result && bannedAuthors?.result?.length > 0){
        const splitedAuthorName = trackAuthor.toLowerCase().split(" ");
        isAuthorBanned = bannedAuthors.result
            .map(a=>  splitedAuthorName.map(an => a.author_names.includes(an))) // Сорри, сложная логика
            .map(a => a.includes(true))
            .includes(true) && decodedToken?.group !== undefined && decodedToken.group < 1
    }

    const pushSong = () => {
        if (trackName == "") return toast.warning("Название песни не указано")
        if (trackAuthor == "") return toast.warning("Автор песни не указан")

        if (trackName.length > 32) return toast.warning("Название песни слишком длинное")
        if (trackAuthor.length > 32) return toast.warning("Автор песни слишком длинный")
        if (trackURL.length > 64) return toast.warning("Ссылка на песню слишком длинная")

        fetch("/api/song/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+jwt
            },
            body: JSON.stringify({
                track_name: trackName,
                track_author: trackAuthor,
                track_url: trackURL
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.success !== true){
                    console.error("PushSong Error:",result);
                    toast.error("Неизвестная ошибка");
                }else{
                    toast.success("Песня успешно добавлена");
                    setTrackAuthor("");
                    setTrackURL("");
                    setTrackName("");
                    mutate(['/api/song/list', jwt]);
                    mutate(['/api/user/likes', jwt]);
                    mutate(['/api/user/dislikes', jwt]);
                    userSongsCount.mutate();
                    handleClose();
                }
            })
            .catch(error => console.log('error', error));
    }

    const isAllowedToAddSong = userSongsCount.data?.result !== undefined && (userSongsCount.data?.result > 9) && decodedToken?.group !== undefined && decodedToken.group < 1

    const isTimeExpired = UNIX_EXPIRED  <= Date.now();

    return (
        <div className="new_song">
            <Button variant="primary" onClick={addSong} disabled={isAllowedToAddSong}>
                Добавить песню {!userSongsCount.error && !userSongsCount.isLoading && userSongsCount.data?.result !== undefined && <>({userSongsCount.data?.result} из 10)</>}
            </Button>
            <TimerBadge unitEnd={UNIX_EXPIRED}/>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавление песни {!userSongsCount.error && !userSongsCount.isLoading && userSongsCount.data?.result && <>({userSongsCount.data?.result} из 10)</>}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isTimeExpired && <Alert variant="danger">
                        Время голосования истекло!
                    </Alert>}
                    <Form>
                        <Form.Group className="mb-3" controlId="formTrackName">
                            <Form.Label>Название песни</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Пожалуйста, пишите оригинальное название."
                                value={trackName}
                                disabled={isTimeExpired}
                                onChange={(e)=>setTrackName((e.target as HTMLInputElement).value)}
                            />
                            <Form.Text className="text-muted">
                                Песни с неверными названиями по типу "звук поставим на всю" могут быть удалены
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formTrackAuthor">
                            <Form.Label>Автор песни</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите автора"
                                    value={trackAuthor}
                                    isInvalid={isAuthorBanned}
                                    onChange={(e)=>setTrackAuthor((e.target as HTMLInputElement).value)}
                                    disabled={isTimeExpired}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Запрещено добавлять иноагентов
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formTrackUrl">
                            <Form.Label>Ссылка на песню в ЯМузыка (не обязательно)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="https://music.yandex.ru/album/14582248/track/79932386?utm_source=desktop&utm_medium=copy_link"
                                value={trackURL}
                                onChange={(e)=>setTrackURL((e.target as HTMLInputElement).value)}
                                disabled={isTimeExpired}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" disabled={isAuthorBanned || isTimeExpired} onClick={pushSong}>
                        Добавить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
function useSWRMutation<T>(arg0: string[], fetchWithToken: any): { trigger: any; } {
    throw new Error("Function not implemented.");
}

