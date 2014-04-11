function tcpServer(){
    var _tcpServer = chrome.sockets.tcpServer;
    this.option = {},
    this.socketId = 0,

    this.create = function(callback){
        _tcpServer.create(this.option, function(socketInfo){
            this.socketId = socketInfo.socketId;
            callback();
        }.bind(this));
    }.bind(this),

    this.update = function(){
        _tcpServer.update(this.socketId, newSocketOption, callback);
    }.bind(this),

    this.pause = function(isPaused, callback){
        _tcpServer.setPaused(this.socketId, isPaused, callback);
    }.bind(this),

    this.disconnect = function(callback){
        _tcpServer.disconnect(this.socketId, callback);
    }.bind(this),

    this.close = function(callback){
        _tcpServer.close(this.socketId, callback);
    }.bind(this),

    this.listen = function(address, port, callback){
        _tcpServer.listen(this.socketId, address, port, function(code){
            if(code<0){
                this.error(code);
                return false;
            }
            else{
                _tcpServer.onAccept.addListener(function(info){
                    if(info.socketId==this.socketId){
                        this.accept(info);
                    }
                }.bind(this));
                _tcpServer.onAcceptError.addListener(function(info){
                    if(info.socketId==this.socketId){
                        this.error(info.resultCode);
                    }
                }.bind(this));
                callback();
            }
        }.bind(this));
    }.bind(this),

    this.error = function(code){
        console.log('An error occurred with code '+code);
    },

    this.accept = function(info){
        console.log('Received data.');
    },

    this.getInfo = function(callback){
        _tcpServer.getInfo(this.socketId, callback);
    }.bind(this),

    this.getSockets = function(callback){
        _tcpServer.getSockets (callback);
    }.bind(this),

    this.init = function(callback){
        this.create(callback);
    }.bind(this)
}