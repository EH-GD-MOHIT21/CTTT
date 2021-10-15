const roomName = "mohit";

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
    if (data.move == '' || data.move == NaN || data.move == null) {
        chatSocket.close()
    }
    if (!data.additional)
        document.getElementById(data.message).innerText = data.move;
    else
        document.getElementById('loggame').textContent = data.message;
    if (data.is_game) {
        document.getElementById(data.position).innerText = data.move;
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