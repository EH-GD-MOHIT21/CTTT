import React from 'react';
import ScriptTag from 'react-script-tag';
import { useParams } from 'react-router';

export default function Playgame(props) {
    const {group} = useParams();

    const csrftoken = props.getCookie('X-CSRFToken');

    async function submithandler(){
        let response = await fetch('/is_valid_gametoken', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                'token': group
            })
        })
        if (response.ok) { 
            let json = await response.json();
            let message = json["message"]
            console.log(message);
            if (message != 'success') {
                window.location.replace("/game")
            }
          } else {
            alert("HTTP-Error: " + response.status);
            window.location.replace("/game")
          }
    }

    submithandler()
    return (
        <>
        <div className="container-fluid">
                <div className="col" id="m1">-</div>
                <div className="col" id="m2">-</div>
                <div className="col" id="m3">-</div>
            
            
                <div className="col" id="m4">-</div>
                <div className="col" id="m5">-</div>
                <div className="col" id="m6">-</div>
            
            
                <div className="col" id="m7">-</div>
                <div className="col" id="m8">-</div>
                <div className="col" id="m9">-</div>

        </div>
        <div className="bottomhandler">
            <div className="logscontainergame">
                <span id="loggame">Welcome to cttt.com</span>
            </div>
            <div className="timemanager">
                <span id="settime">30</span><span> Sec Left to Respond</span>
            </div>
        </div>
        <ScriptTag src="/public/tttserver.js"></ScriptTag>
        </>
    )
}
