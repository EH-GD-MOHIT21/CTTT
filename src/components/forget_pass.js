import Textfield from "../muic/textfield";
import Buttonfield from "../muic/buttonfield";
import {Link} from "react-router-dom";
import Progress from "../muic/progress";

export default function Forgetpass(props) {

    const csrftoken = props.getCookie('X-CSRFToken');

    async function submithandler(event){
        event.preventDefault();
        document.getElementById('loginprogress').style.display = 'block';
        let response = await fetch('/auth/forgotpass', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                'username': document.getElementById('username').value
            })
        })
        if (response.ok) { 
            document.getElementById('loginprogress').style.display = 'none';
            document.getElementById("verifier").style.display = 'block';
            let json = await response.json();
            let message = json["message"]
            console.log(message);
            if (message != 'Reset Instructions send on mail.') {
                document.getElementById("verifier").textContent = message;
                document.getElementById("verifier").style.color = "crimson"
                document.getElementById("verifier").style.fontWeight = 600;
            } else {
                document.getElementById("verifier").textContent = message;
                document.getElementById("verifier").style.color = "green"
                document.getElementById("verifier").style.fontWeight = 600;
            }
          } else {
            document.getElementById('loginprogress').style.display = 'none';
            alert("HTTP-Error: " + response.status);
          }
    }

    return (
        <div className="vh100">
            <div className="containerlogin" id="containerlogin">
            <Progress className="loginprogress" id="loginprogress"/>
                <form action="">
                <div className="titlelog">
                    <h2>Welcome to CTTT.COM</h2>
                    <h3>Account Recovery</h3>
                </div>
                <Textfield className="textfieldclogin" id="username" label="Username" type="email"/>
                <Link className="cafromlogin" to="/login">Remember Password?</Link>
                <Buttonfield className="buttonfieldclogin" id="loginbutton" type="submit" value="Procced" submithandler={submithandler}/>
                <span id="verifier"></span>
                </form>
            </div>
            
        </div>
    )
}
