module.exports = app => {
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3030 });
let connections = [];
let oldMessages = [];

wss.on('connection', function connection(ws) {
    //console.log("Data : "+ JSON.stringify(ws))
  ws.on('message', function incoming(data) {
      const info = JSON.parse(data);
    if (info.hasOwnProperty('disconnect')){
        console.log("User " + info.sender + ' has disconnected from ' + info.receiver);
        connections = connections.filter(x => x.email !== info.sender && x.sendto !== info.receiver);
    }
        else
    if (info.hasOwnProperty('id')) {
        console.log('User ' + info.id + ' connected  to send messages to ' + info.receiver);
        connections = connections.filter(x => x.email !== info.id && x.sendto !== info.receiver);
        connections.push({email: info.id, sendto: info.receiver, sock: ws});

        //check old messages
        if (oldMessages.filter(x => x.sender === info.receiver && x.receiver === info.id).length !== 0) {
            const index = oldMessages.findIndex(x => x.sender === info.receiver && x.receiver === info.id);
            
            for(let i = 0; i < oldMessages[index].messages.length; i++) {
                console.log(oldMessages[index].messages[i]);
                const message = {
                                direction: 'right', 
                                message: oldMessages[index].messages[i]
                            }
                ws.send(JSON.stringify(message));
            }
        }
        else {
            console.log("No new messages");
        }
    }
    else {
        console.log('Received: ' + info.message + ' from ' + info.sender + ' to ' + info.receiver);
        const receiver = connections.filter(x => x.email === info.receiver && x.sendto === info.sender);
        if (receiver && receiver.length !== 0)
            receiver[0].sock.send(data);
        else {
            console.log("Sending data failed: " + info.receiver + ' not connected. Will try again later.');
            if (oldMessages.filter(x => x.sender === info.sender && x.receiver === info.receiver).length !== 0) {
                const index = oldMessages.findIndex(x => x.sender === info.sender && x.receiver === info.receiver);
                oldMessages[index].messages.push(info.message);
            }
            else{
                oldMessages.push({sender: info.sender, receiver: info.receiver, messages: [info.message]});
            }
        }
    }
  });
});
}