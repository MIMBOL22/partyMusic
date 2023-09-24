import React, {useEffect, useRef, useState} from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {Connect, ConnectEvents} from "@vkontakte/superappkit";

export const NavBar = () => {
    const [isSigned, _] = useState(false);
    const vkAuthDiv = useRef<HTMLDivElement>(null);

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
                    return;
                case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED:
                case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED:
                case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN:
                    return Connect.redirectAuth({url: "https://...", state: "dj29fnsadjsd82..."});
                case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS:
                    return Connect.redirectAuth({screen: "phone", url: "https://..."});
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
    }, [vkAuthDiv]);


    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Осенний бал</Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse className="justify-content-end">
                    {isSigned && <Navbar.Text>
                        Вы вошли как: <a href="#">Макр Отто</a>
                    </Navbar.Text>}
                    <div ref={vkAuthDiv}></div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};