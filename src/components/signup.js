import Passwordfield from "../muic/passwordfield";
import Textfield from "../muic/textfield";
import Buttonfield from "../muic/buttonfield";
import {Link} from "react-router-dom";
import Progress from "../muic/progress";

export default function Signup(props) {

    const csrftoken = props.getCookie('X-CSRFToken');

    async function submithandler(event){
        event.preventDefault();
        document.getElementById('signupprogress').style.display = 'block';
        let response = await fetch('/auth/signup', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                "first_name":document.getElementById('first_name').value,
                "last_name":document.getElementById("last_name").value,
                'email': document.getElementById('username').value,
                "password": document.getElementById("password").value,
                "confirm_pass":document.getElementById('cpassword').value
            })
        })
        if (response.ok) { 
            document.getElementById('signupprogress').style.display = 'none';
            document.getElementById("verifier").style.display = 'block';
            let json = await response.json();
            let message = json["message"]
            console.log(message);
            if (message != 'OTP send on provided mail id.') {
                document.getElementById("verifier").textContent = message;
                document.getElementById("verifier").style.color = "crimson"
                document.getElementById("verifier").style.fontWeight = 600;
            } else {
                document.getElementById("verifier").textContent = message;
                document.getElementById("verifier").style.color = "green"
                document.getElementById("verifier").style.fontWeight = 600;
                document.getElementById('containersignup').style.display = 'none';
                document.getElementById('containersignupotp').style.display = 'flex';
            }
          } else {
            document.getElementById('signupprogress').style.display = 'none';
            alert("HTTP-Error: " + response.status);
          }
    }

    async function submithandlerfinal(event){
        event.preventDefault();
        document.getElementById('signupprogressotp').style.display = 'block';
        let response = await fetch('/auth/signup/verify/user='+document.getElementById('username').value, {
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
            document.getElementById('signupprogressotp').style.display = 'none';
            document.getElementById("verifierp").style.display = 'block';
            let json = await response.json();
            let message = json["message"]
            console.log(message);
            if (message == 'Invalid Request.' || message == 'Incorrect OTP.' || message == 'user not exists.') {
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
            document.getElementById('signupprogressotp').style.display = 'none';
            alert("HTTP-Error: " + response.status);
          }
    }

    return (
        <div className="vh100">
            <div className="containersignup" id="containersignup">
            <Progress className="signupprogress" id="signupprogress"/>
                <form action="">
                <div className="titlelog">
                    <h2>Welcome to CTTT.COM</h2>
                    <h3>SignUp</h3>
                </div>
                <Textfield className="textfieldcsignup" id="first_name" label="First Name" type="text"/>
                <Textfield className="textfieldcsignup" id="last_name" label="Last Name" type="text"/>
                <Textfield className="textfieldcsignup" id="username" label="Email" type="email"/>
                <Passwordfield className="passfieldcsignup" id="password" label="password"/>
                <Passwordfield className="passfieldcsignup" id="cpassword" label="Confirm Password"/>
                <Link className="signupfromca" to="/login">Already have an account?</Link>
                <Buttonfield className="buttonfieldcsignup" id="signupbutton" type="submit" value="Next" submithandler={submithandler}/>
                <span id="verifier"></span>
                </form>
            </div>
            <div className="containersignupotp" id="containersignupotp">
            <Progress className="signupprogressotp" id="signupprogressotp"/>
                <form action="">
                <div className="titlelog">
                    <h2>Welcome to CTTT.COM</h2>
                    <h3>SignUp</h3>
                </div>
                <Textfield className="textfieldcsignup" id="OTP" label="OTP" type="number"/>
                <Buttonfield className="buttonfieldcsignup" id="signupbuttonsubmit" type="submit" value="Procced" submithandler={submithandlerfinal}/>
                <span id="verifierp"></span>
                </form>
            </div>
        </div>
    )
}
