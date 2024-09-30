import {TwinkVideo} from "../сomponents/TwinkVideo";
import "./TwinkPage.css";
import {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";

export const TwinkPage = () => {
    const [isMagic, setIsMagic] = useState(false);


    const doMagic = () => {
        console.log("Do magic!")
        setIsMagic(c => !c);
    }

    return (<>
        <Modal show={!isMagic} onHide={doMagic}>
            <Modal.Header closeButton>
                <Modal.Title>Политика конфеденциальности</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Подтвердите согласие на обработку персональных данных</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={doMagic}>Отмена</Button>
                <Button variant="primary" onClick={doMagic}>Подтвердить</Button>
            </Modal.Footer>
        </Modal>
        {isMagic ? "L":"i"}
        <TwinkVideo magic={isMagic}/>
    </>)
}