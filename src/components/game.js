import React from 'react';
import Textfield from "../muic/textfield";
import Buttonfield from "../muic/buttonfield";
import Progress from '../muic/progress';

export default function Game(props) {
    
    const csrftoken = props.getCookie('X-CSRFToken');

    async function submithandler(event){
        event.preventDefault();
        document.getElementById('loginprogressotp').style.display = 'block';
        let response = await fetch('is_valid_gametoken', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                "token":document.getElementById("joinroom").value
            })
        })
        if (response.ok) { 
            document.getElementById('loginprogressotp').style.display = 'none';
            document.getElementById("gametokenverifier").style.display = 'block';
            let json = await response.json();
            let message = json["message"]
            console.log(message);
            if (message != 'success') {
                document.getElementById("gametokenverifier").textContent = message;
                document.getElementById("gametokenverifier").style.color = "crimson"
                document.getElementById("gametokenverifier").style.fontWeight = 600;
            } else {
                document.getElementById("gametokenverifier").textContent = message;
                document.getElementById("gametokenverifier").style.color = "green"
                document.getElementById("gametokenverifier").style.fontWeight = 600;
                window.location.href = "/play/"+document.getElementById('joinroom').value
            }
          } else {
            document.getElementById('loginprogressotp').style.display = 'none';
            alert("HTTP-Error: " + response.status);
          }
    }
    return (
        <div className="gamejoinorcreate">
            <Progress className="loginprogressotp" id="loginprogressotp"/>
            <Textfield className="textfieldclogin" id="joinroom" label="Enter Room Token" type="text"/>
            <Buttonfield className="buttonfieldclogin" id="joinroombtn" type="submit" value="Check" submithandler={submithandler}/>
            <span id="gametokenverifier"></span>
        </div>
    )
}
