import Passwordfield from "../muic/passwordfield";
import Buttonfield from "../muic/buttonfield";
import { useParams } from "react-router";
import axios from "axios";
import Progress from "../muic/progress";

export default function Changepass(props) {

    const csrftoken = props.getCookie('X-CSRFToken');

    const {user,token} = useParams();
    // 
    // To be fixed 
    axios.post("/auth/isExistsFPR",{"username":user,"token":token}).then(response=>{
        if(response.data["message"]!='success'){
            window.location.href = "/forgetpass"
        }
    })

    async function submithandler(event){
        event.preventDefault();
        document.getElementById('loginprogress').style.display = 'block';
        let response = await fetch('/auth/forgotpass/user='+user+'/token='+token, {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                "password": document.getElementById("password").value,
                "confirmpass": document.getElementById("cpassword").value
            })
        })
        if (response.ok) { 
            document.getElementById('loginprogress').style.display = 'none';
            document.getElementById("verifier").style.display = 'block';
            let json = await response.json();
            let message = json["message"]
            console.log(message);
            if (message != 'success' && message!= 'Login success but confirmation mail not send.') {
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
                    <h3>Change Password</h3>
                </div>
                <Passwordfield className="passfieldclogin" id="password" label="password"/>
                <Passwordfield className="passfieldclogin" id="cpassword" label="Confirm password"/>
                <Buttonfield className="buttonfieldclogin" id="loginbutton" type="submit" value="Save" submithandler={submithandler}/>
                <span id="verifier"></span>
                </form>
            </div>
        </div>
    )
}
