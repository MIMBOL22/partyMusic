import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import { useJwt } from "react-jwt";
import { toast } from "react-toastify";
import useLocalStorage from "use-local-storage";
import { IJWTUser } from "../interfaces/IJWTUser";
import "./NewSong.css"
import { useSWRConfig } from "swr";

export const NewSong = () => {
    const [jwt, setJwt] = useLocalStorage('jwt', "");
    const {decodedToken, isExpired} = useJwt<IJWTUser>(jwt);
    const isLogged = !isExpired && jwt !== "";

    const { mutate } = useSWRConfig()

    const [trackName, setTrackName] = useState("");
    const [trackAuthor, setTrackAuthor] = useState("");
    const [trackURL, setTrackURL] = useState("");


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addSong = () => {
        if (!isLogged) return toast.info("Для этого нужно войти");
        if (decodedToken?.banned) return toast.error("Вы заблокированы");
        handleShow();
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
                    handleClose();
                }
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className="new_song">
            <Button variant="primary" onClick={addSong}>
                Добавить песню
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавление песни</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formTrackName">
                            <Form.Label>Название песни</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Пожалуйста, пишите оригинальное название."
                                value={trackName}
                                onChange={(e)=>setTrackName((e.target as HTMLInputElement).value)}
                            />
                            <Form.Text className="text-muted">
                                Пести с неверными названиями по типу "звук поставим на всю" могут быть удалены
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formTrackAuthor">
                            <Form.Label>Автор песни</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите автора"
                                value={trackAuthor}
                                onChange={(e)=>setTrackAuthor((e.target as HTMLInputElement).value)}
                            />
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formTrackUrl">
                            <Form.Label>Ссылка на песню в YouTube (не обязательно)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                value={trackURL}
                                onChange={(e)=>setTrackURL((e.target as HTMLInputElement).value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={pushSong}>
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

