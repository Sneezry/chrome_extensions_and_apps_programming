function tcp(){
    var _tcp = chrome.sockets.tcp;
    this.option = {},
    this.socketId = 0,

    this.create = function(callback){
        _tcp.create(this.option, function(socketInfo){
            this.socketId = socketInfo.socketId;
            callback();
        }.bind(this));
    }.bind(this),

    this.update = function(){
        _tcp.update(this.socketId, newSocketOption, callback);
    }.bind(this),

    this.pause = function(isPaused, callback){
        _tcp.setPaused(this.socketId, isPaused, callback);
    }.bind(this),

    this.keepAlive = function(enable, delay, callback){
        _tcp.setKeepAlive(this.socketId, enable, delay, function(code){
            if(code<0){
                this.error(code);
            }
            else{
                callback();
            }
        }.bind(this));
    }.bind(this),

    this.noDelay = function(noDelay, callback){
        _tcp.setNoDelay(this.socketId, noDelay, function(code){
            if(code<0){
                this.error(code);
            }
            else{
                callback();
            }
        }.bind(this));
    }.bind(this),

    this.disconnect = function(callback){
        _tcp.disconnect(this.socketId, callback);
    }.bind(this),

    this.close = function(callback){
        _tcp.close(this.socketId, callback);
    }.bind(this),

    this.error = function(code){
        console.log('An error occurred with code '+code);
    },

    this.connect = function(address, port, callback){
        _tcp.connect(this.socketId, address, port, function(){
            _tcp.onReceive.addListener(function(info){
                if(info.socketId==this.socketId){
                    this.receive(info);
                }
            }.bind(this));
            _tcp.onReceiveError.addListener(function(info){
                if(info.socketId==this.socketId){
                    this.error(info.resultCode);
                }
            }.bind(this));
        }.bind(this));
    }.bind(this),

    this.send = function(data, callback){
        _tcp.send(this.socketId, data, callback);
    }.bind(this),

    this.receive = function(info){
        console.log('Received data .');
    },

    this.getInfo = function(callback){
        _tcp.getInfo(this.socketId, callback);
    }.bind(this),

    this.getSockets = function(callback){
        _tcp.getSockets (callback);
    }.bind(this),

    this.init = function(callback){
        this.create(callback);
    }.bind(this)
}