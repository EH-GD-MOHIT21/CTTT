import Passwordfield from "../muic/passwordfield";
import Textfield from "../muic/textfield";
import Buttonfield from "../muic/buttonfield";
import {Link} from "react-router-dom";
import Progress from "../muic/progress";

export default function Login(props) {

    const csrftoken = props.getCookie('X-CSRFToken');
    
    async function submithandler(event){
        event.preventDefault();
        document.getElementById('loginprogress').style.display = 'block';
        let response = await fetch('/auth/login', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                'username': document.getElementById('username').value,
                "password": document.getElementById("password").value
            })
        })
        if (response.ok) { 
            document.getElementById('loginprogress').style.display = 'none';
            document.getElementById("verifier").style.display = 'block';
            let json = await response.json();
            let message = json["message"]
            console.log(message);
            if (message != 'OTP send for verification.' && message!= 'otp send please try after 5 minutes.') {
                document.getElementById("verifier").textContent = message;
                document.getElementById("verifier").style.color = "crimson"
                document.getElementById("verifier").style.fontWeight = 600;
            } else {
                document.getElementById("verifier").textContent = message;
                document.getElementById("verifier").style.color = "green"
                document.getElementById("verifier").style.fontWeight = 600;
                document.getElementById('containerlogin').style.display = 'none';
                document.getElementById('containerloginotp').style.display = 'flex';
            }
          } else {
            document.getElementById('loginprogress').style.display = 'none';
            alert("HTTP-Error: " + response.status);
          }
    }

    async function submithandlerfinal(event){
        event.preventDefault();
        document.getElementById('loginprogressotp').style.display = 'block';
        let response = await fetch('/auth/login/verify/user='+document.getElementById('username').value, {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                "otp":document.getElementById("OTP").value
            })
        })
        if (response.ok) { 
            document.getElementById('loginprogressotp').style.display = 'none';
            document.getElementById("verifierp").style.display = 'block';
            let json = await response.json();
            let message = json["message"]
            console.log(message);
            if (message != 'success' && message!= 'Login success but confirmation mail not send.') {
                document.getElementById("verifierp").textContent = message;
                document.getElementById("verifierp").style.color = "crimson"
                document.getElementById("verifierp").style.fontWeight = 600;
            } else {
                document.getElementById("verifierp").textContent = message;
                document.getElementById("verifierp").style.color = "green"
                document.getElementById("verifierp").style.fontWeight = 600;
                window.location.href = "/game";
                // redirect here to game
            }
          } else {
            document.getElementById('loginprogressotp').style.display = 'none';
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
                    <h3>Signin</h3>
                </div>
                <Textfield className="textfieldclogin" id="username" label="Username" type="email"/>
                <Passwordfield className="passfieldclogin" id="password" label="password"/>
                <Link className="fplogin" to="/forgetpass">Forgot Password?</Link>
                <Buttonfield className="buttonfieldclogin" id="loginbutton" type="submit" value="Next" submithandler={submithandler}/>
                <span id="verifier"></span>
                <Link className="cafromlogin" to="/signup">Create Account</Link>
            </form>
            </div>
            <div className="containerloginotp" id="containerloginotp">
            <Progress className="loginprogressotp" id="loginprogressotp"/>
                <form action="">
                <div className="titlelog">
                    <h2>Welcome to CTTT.COM</h2>
                    <h3>Signin</h3>
                </div>
                <Textfield className="textfieldclogin" id="OTP" label="OTP" type="number"/>
                <span id="verifierp"></span>
                <Buttonfield className="buttonfieldclogin" id="loginbuttonsubmit" type="submit" value="Procced" submithandler={submithandlerfinal}/>
                </form>
            </div>
        </div>
    )
}
