import React from "react";
import {Alert, Badge} from "react-bootstrap";
import useSWR from "swr";
import {IAPIBannedAuthor} from "../interfaces/IAPIBannedAuthor";
import {fetchWithToken} from "../fetcher";

export const AuthorsWarning = () => {
    // @ts-ignore
    const {data, error, isLoading} = useSWR<IAPIBannedAuthor>(["/api/authors/banned",""], fetchWithToken);

    return (
        <Alert variant='warning'>
            {error && <p>Ошибка загрузки иноагентов</p>}
            {isLoading && <p>Загрузка иноагентов...</p>}
            <h1>
                ВНИМАНИЕ! <Badge bg="danger">Важно</Badge>
            </h1>
            {!isLoading && !error && <>
                <h4>Следующие исполнители <u><b>запрещены</b></u> к добавлению:</h4>
                <ul>
                    {data?.result.map(author =>
                        <li key={author.id}><h5>{author.official_name}*</h5></li>
                    )}
                </ul>
                <p>* - лица, признанные Минюстом РФ иностранными агентами на территории РФ</p>
            </>}
            <h4>Правила: (за нарушение - бан)</h4>
            <ul>
                <li><h5>10 песен на одного пользователя</h5></li>
                <li><h5>Запрещён спам</h5></li>
                <li><h5>Запрещено добавлять песни иноагентов (выше)</h5></li>
                <li><h5>Запрещёны твинк-аккаунты</h5></li>
            </ul>
            <h4>
                Плейлист песен, которые точно будут и не участвуют в голосовании: <a href="https://music.yandex.ru/users/mimbol/playlists/1001">ТЫК</a>
            </h4>
            <h4>По любым вопросам обращаться к администратору сайта:</h4>
            <h4>
                Малыгин Александр
                (
                <a href="https://vk.com/mimbol">VK</a> | <a href="https://t.me/mimbol">Telegram</a> | mimbol@yandex.com
                )
            </h4>
        </Alert>
    )
}