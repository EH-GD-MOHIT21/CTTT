const roomName = document.URL.split('/')[document.URL.split('/').length - 1];

const chatSocket = new WebSocket(
    'ws://' +
    window.location.host +
    '/ws/ttt/' +
    roomName +
    '/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log(data.additional);
    console.log(data.message);
    console.log("current: " + data.move);
    console.log("next: " + data.next_move);
    if (data.message == "Let's start the game") {
        id = setInterval(mohitfunc, 1000, data);
        document.getElementById('loggame').innerText = "It's turn for " + data.next_move + " now";
    }
    if (data.move == '' || data.move == NaN || data.move == null) {
        chatSocket.close()
    }
    if (!data.additional) {
        try {
            clearInterval(id);
        } catch (err) {}
        id = setInterval(mohitfunc, 1000, data);
        document.getElementById('settime').textContent = data.time;
        document.getElementById(data.message).innerText = data.move;
        document.getElementById('loggame').innerText = "It's turn for " + data.next_move + " now";
    } else {
        document.getElementById('loggame').textContent = data.message;
    }
    if (data.is_game) {
        document.getElementById(data.position).innerText = data.move;
        try {
            clearInterval(id);
        } catch (err) {}
        chatSocket.close();
    }
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};


function submitbtn() {
    move = this.id;
    console.log('submit' + move)
    chatSocket.send(JSON.stringify({
        'message': move
    }));
};

for (var i = 1; i <= 9; i++) {
    document.getElementById("m" + i).addEventListener('click', submitbtn);
}

function mohitfunc(data) {
    if (parseInt(data.time) > 0) {
        document.getElementById('settime').textContent = data.time - 1;
        data.time -= 1;
    } else {
        chatSocket.close();
        document.getElementById('loggame').textContent = "Player " + data.next_move + " Didn't Responed in time limit Game Over.";
    }
}