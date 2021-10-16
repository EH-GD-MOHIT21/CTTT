import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Switch,Route,Redirect} from "react-router-dom";
import Login from './components/login';
import Signup from './components/signup';
import Forgetpass from './components/forget_pass';
import Changepass from './components/changepass';
import Game from "./components/game";
import { useEffect, useState } from 'react';
import axios from "axios";
import Playgame from './components/playgame';

function App() {

  const [loggedIn,SetloggedIn] = useState(false);
    axios.get('/auth/is_auth')
    .then(response=>{
      SetloggedIn(response.data["is_auth"])
    }
  )

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  return (
    <Router>
      <Switch>
      <Route path="/game">
        {loggedIn ? <Game getCookie={getCookie}/> : <Login getCookie={getCookie}/>}
        </Route>
        <Route path="/login">
        {loggedIn ? <Redirect to="/game" /> : <Login getCookie={getCookie}/>}
        </Route>
        <Route path="/signup">
        {loggedIn ? <Redirect to="/game" /> : <Signup getCookie={getCookie}/>}
        </Route>
        <Route exact path="/forgetpass/user=:user/token=:token">
        {loggedIn ? <Redirect to="/game" /> : <Changepass getCookie={getCookie}/>}
          </Route>
        <Route exact path="/forgetpass">
        {loggedIn ? <Redirect to="/game" /> : <Forgetpass getCookie={getCookie}/>}
          </Route>
        <Route path="/play/:group">
          {loggedIn ? <Playgame getCookie={getCookie}/> : <Login getCookie={getCookie}/>}
          </Route>
      </Switch>
    </Router>
  );
}

export default App;
