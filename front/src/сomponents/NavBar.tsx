import React, {useEffect, useRef, useState} from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {
    Connect, ConnectEvents, OneTapAuthEventsSDK, VKAuthButtonCallbackResult,
    VKDataPolicyPayload, VKSilentAuthPayload
} from "@vkontakte/superappkit";
import useLocalStorage from "use-local-storage";
import {useJwt} from "react-jwt";
import {toast} from "react-toastify";
import {VKAuthButtonErrorPayload, VKOauth2Payload} from "@vkontakte/superappkit/dist/connect/types";

type VKPayload =
    VKSilentAuthPayload
    | VKDataPolicyPayload
    | { uuid: string; }
    | VKOauth2Payload
    | VKAuthButtonErrorPayload

export const NavBar = () => {
    const [jwt, setJwt] = useLocalStorage('jwt', "");
    const [fullname, setFullname] = useLocalStorage('fullname', "");
    const {decodedToken, isExpired} = useJwt(jwt);
    const isLogged = !isExpired && jwt !== "";

    const renderCounter = useRef(0);
    renderCounter.current++;

    const vkAuthDiv = useRef<HTMLDivElement>(null);

    const authApi = (payload: VKPayload) => {
        fetch("/api/user/auth/vk", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // @ts-ignore
                silent_token: payload.token,
                // @ts-ignore
                uuid: payload.uuid,
                // @ts-ignore
                firstName: payload.user.first_name,
                // @ts-ignore
                lastName: payload.user.last_name
            }),
            redirect: 'follow'
        })
            .then(response => response.json())
            .then(result => {
                // @ts-ignore
                setFullname(payload.user.first_name + " " + payload.user.last_name)
                setJwt(result.accessToken);
                toast.success('Успешный вход');
            })
            .catch(error => console.log('error', error));
    }

    const authNeed = useRef(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const payload = urlParams.get('payload');


        if (payload !== null && authNeed.current) {
            console.log(JSON.parse(payload));
            authNeed.current = false;
            window.history.replaceState(null, '', window.location.pathname);
            authApi(JSON.parse(payload))
        }
    }, []);
    useEffect(() => {
        const oneTapButton = Connect.buttonOneTapAuth({
            callback: event => {
                const {type} = event;

                if (!type) {
                    return;
                }

                switch (type) {
                    case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS:
                        console.log(event);
                        // @ts-ignore
                        if (event?.payload?.token !== undefined && event?.payload?.uuid !== undefined) {
                            authApi(event.payload);
                        }
                        return;
                    case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED:
                    case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED:
                    case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN:
                        return Connect.redirectAuth({url: 'https://' + window.location.hostname});
                    case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS:
                        return Connect.redirectAuth({url: 'https://' + window.location.hostname, screen: 'phone'});
                }

                return;
            },
            options: {
                displayMode: "default",
                langId: 0,
                scheme: "space_gray",
                buttonStyles: {
                    borderRadius: 8,
                    height: 50,
                },
            },
        });
        let vkFrame;

        if (oneTapButton) vkFrame = oneTapButton.getFrame();
        if (vkFrame && vkAuthDiv.current && vkAuthDiv.current.innerHTML === "") {
            vkAuthDiv.current.appendChild(vkFrame);
        }
    }, [vkAuthDiv, jwt]);


    const logout = () => {
        setJwt("");
        setFullname("");
        // window.location.reload();
    }


    console.log("U", jwt, isExpired, decodedToken)
    // if (jwt != "" && isExpired && decodedToken != null && renderCounter.current > 2) { // Маленький костыль
    //     logout();
    // }

    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Осенний бал</Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse className="justify-content-end">
                    {isLogged && <Navbar.Text>
                        <p style={{marginBottom: "0"}}>
                            Вы вошли как: {fullname}
                            <a href="#" onClick={logout} style={{marginLeft: "5px"}}>Выйти</a>
                        </p>
                    </Navbar.Text>}
                    {!isLogged && <div ref={vkAuthDiv}></div>}

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
