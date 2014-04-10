function udp(){
    var _udp = chrome.sockets.udp;
    this.option = {},
    this.socketId = 0,
    this.localAddress = '0.0.0.0',
    this.localPort = 0,

    this.create = function(callback){
        _udp.create(this.option, function(socketInfo){
            this.socketId = socketInfo.socketId;
            callback();
        }.bind(this));
    }.bind(this),

    this.update = function(){
        _udp.update(this.socketId, newSocketOption, callback);
    }.bind(this),

    this.pause = function(isPaused, callback){
        _udp.setPaused(this.socketId, isPaused, callback);
    }.bind(this),

    this.bind = function(callback){
        _udp.bind(this.socketId, this.localAddress, this.localPort, callback);
    }.bind(this),

    this.close = function(callback){
        _udp.close(this.socketId, callback);
    }.bind(this),

    this.send = function(address, port, data, callback){
        _udp.send(this.socketId, data, address, port, callback);
    }.bind(this),

    this.receive = function(info){
        console.log('Received data from '+info.removeAddress+':'+info.removePort);
    },

    this.error = function(code){
        console.log('An error occurred with code '+code);
    },

    this.joinGroup = function(address, callback){
        _udp.joinGroup(this.socketId, address, function(code){
            if(code<0){
                this.error(code);
                return false;
            }
            else{
                callback();
            }
        }.bind(this));
    }.bind(this),

    this.leaveGroup = function(address, callback){
        _udp.leaveGroup(this.socketId, address, function(code){
            if(code<0){
                this.error(code);
                return false;
            }
            else{
                callback();
            }
        }.bind(this));
    }.bind(this),

    this.setMilticastTTL = function(ttl, callback){
        _udp.setMulticastTimeToLive(this.socketId, ttl, function(code){
            if(code<0){
                this.error(code);
                return false;
            }
            else{
                callback();
            }
        }.bind(this));
    }.bind(this),

    this.setMilticastLoopback = function(enabled, callback){
        _udp.setMulticastLoopbackMode(this.sockedId, enabled, function(code){
            if(code<0){
                this.error(code);
                return false;
            }
            else{
                callback();
            }
        }.bind(this));
    }.bind(this),

    this.getInfo = function(callback){
        _udp.getInfo(this.socketId, callback);
    }.bind(this),

    this.getSockets = function(callback){
        _udp.getSockets (callback);
    }.bind(this),

    this.getGroups = function(callback){
        _udp.getJoinedGroups(this.socketId, callback);
    }.bind(this),

    this.init = function(callback){
        this.create(function(){
            this.bind(function(code){
                if(code<0){
                    this.error(code);
                    return false;
                }
                else{
                    callback();
                }
            }.bind(this));
            _udp.onReceive.addListener(function(info){
                if(info.socketId==this.socketId){
                    this.receive(info);
                }
            }.bind(this));
            _udp.onReceiveError.addListener(function(info){
                if(info.socketId==this.socketId){
                    this.error(info.resultCode);
                }
            });
        }.bind(this));
    }.bind(this)
}