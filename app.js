/**
 * Simple chat application for nodejs
 */
var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    nicknames = [];

server.listen(3000);

app.get('/', function(req, res){
    res.sendfile(__dirname + '/app/index.html');
});

app.use(express.static(__dirname + '/app/bower_components'));
app.use(express.static(__dirname + '/app/resources'));

io.sockets.on('connection',function(socket){

    function updateNicknames(){
        io.sockets.emit('users',nicknames);
    }

    socket.on('resisterUser', function(data , callback){
        if(nicknames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            updateNicknames();
        }
    });

    socket.on('sendMessage',function(data){
        io.sockets.emit('newMessage',{
            message : data,
            nickname : socket.nickname
        });
    });

    socket.on('disconnect', function(data){
        if(!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname) , 1);
        updateNicknames();
    });

});
