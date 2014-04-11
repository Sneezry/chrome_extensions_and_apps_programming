var tcpServerSocket = new tcpServer();
tcpServerSocket.option = {
    persistent: false
};
tcpServerSocket.accept = handleAccept.bind(tcpServerSocket);
tcpServerSocket.init(function(){
    tcpServerSocket.listen('127.0.0.1', 80, function(){
        console.log('Listening 127.0.0.1:80...');
    });
});

function str2ab(str){
    var buf = new ArrayBuffer(str.length);
    bufView = new Uint8Array(buf);
    for(var i=0; i<str.length; i++){
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ab2str(buf){
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function handleAccept(info){
    if(info.socketId==this.socketId){
        var _tcp = chrome.sockets.tcp;
        var tcpSocket = new tcp();
        tcpSocket.socketId = info.clientSocketId;
        tcpSocket.keepAlive(true, 5, function(){
            _tcp.onReceive.addListener(function(info){
                if(info.socketId==tcpSocket.socketId){
                    tcpSocket.receive(info);
                }
            });
            _tcp.onReceiveError.addListener(function(info){
                if(info.socketId==tcpSocket.socketId){
                    tcpSocket.error(info.resultCode);
                }
            });
            tcpSocket.receive = handleRequest.bind(tcpSocket);
            tcpSocket.pause(false, function(){
                console.log('Receiving data...');
            });
        });
    }
}

function handleRequest(info){
    var header = ab2str(info.data);
    header = header.split("\r\n").join('<br />');
    var body = "<h1>It Works!</h1>"+
               "<hr />"+
               "Request Header:<br />"+header;
    var respondse = "HTTP/1.1 200 OK\r\n"+
                    "Connection: Keep-Alive\r\n"+
                    "Content-Length: "+body.length+"\r\n"+
                    "Content-Type: text/html\r\n"+
                    "Connection: close\r\n\r\n"+body;
    respondse = str2ab(respondse);
    this.send(respondse, function(){
        console.log('Sent.');
        this.close(function(){
            console.log('Closed.');
        })
    }.bind(this));
}