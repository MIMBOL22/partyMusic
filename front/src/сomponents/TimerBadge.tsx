import React, {PropsWithChildren, useEffect, useState} from "react";
import {Badge} from "react-bootstrap";

interface TimerBadgeProps {
    unitEnd: number;
}

export const TimerBadge = (props: PropsWithChildren<TimerBadgeProps>) => {
    const [unixTime, setUnixTime] = useState(Date.now());

    useEffect(() => {
        const timerID = setInterval(()=>{
            setUnixTime(Date.now())
        },1000)

        return () =>{
            clearInterval(timerID);
        }
    }, []);

    const days = Math.floor((props.unitEnd - unixTime) / 86400000)
    const hours = Math.floor((props.unitEnd - unixTime)  % 86400000 / 3600000)
    const minutes = Math.floor((props.unitEnd - unixTime) % 3600000 / 60000)
    const seconds = Math.floor((props.unitEnd - unixTime) % 60000 / 1000)
    const isExpired = props.unitEnd <= unixTime;



    return (
        <h3>
            <br/>
            Осталось &nbsp;
            <Badge bg={isExpired?"danger":"primary"}>
                {days<10 && "0"}{days > 0 && days}{days <= 0 && "0"}
                :
                {hours<10 && "0"}{hours > 0 && hours}{hours <= 0 && "0"}
                :
                {minutes<10 && "0"}{minutes > 0 && minutes}{minutes <= 0 && "0"}
                :
                {seconds<10 && "0"}{seconds > 0 && seconds}{seconds <= 0 && "0"}
            </Badge>
        </h3>
    );
};