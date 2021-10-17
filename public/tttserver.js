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
        if (data.move == 'X') {
            document.getElementById(data.message).innerHTML = "<img src='/media/x.png'>";
        } else {
            document.getElementById(data.message).innerHTML = "<img src='/media/o.jpg'>";
        }
        document.getElementById('loggame').innerText = "It's turn for " + data.next_move + " now";
    } else {
        document.getElementById('loggame').textContent = data.message;
    }
    if (data.is_game) {
        if (data.move == 'X') {
            document.getElementById(data.position).innerHTML = "<img src='/media/x.png'>";
        } else {
            document.getElementById(data.position).innerHTML = "<img src='/media/o.jpg'>";
        }
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