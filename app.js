// Seta as vars do socket.io
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
// Chama o index.html
app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/index.html');
});
// Escuta a porta
http.listen(3000, function(){
  console.log('Rodando na porta *:3000');
});
// Escuta e executa o socket.io 
io.on('connection', function (socket){
	var idd = socket.id;
	io.emit('user setID', idd);
	// Quando envia mensagem
	socket.on('chat message', function (msg){
		// Envia a mensagem		
		io.emit('chat message', msg);
	});
	// Seta o ID
    socket.on('user setID', function (id){
    	io.emit('user setID', id);
    })
	// Entra na sala
	socket.on('chat join', function(user, image){
		user.ids = socket.id;
		users.push(user);
		var msg = '<img id="picture" src="' + user.image + '"/> <strong><font color="#6600ff">' + user.name + '</font><font color="#ff0000">  entrou na sala. </font></strong>';
		io.emit('chat message', msg);
	})
	// Sai da sala
	socket.on('disconnect', function () {
		var lost = 'Usuário Indefinido';
		var msg = '<strong><font color="#6600ff">'+lost+'</font><font color="#ff0000">  saiu do chat.</font></strong>';
		for(var i = 0; i < users.length; i++){
			if(socket.id === users[i].ids){
				msg = '<img src="' + users[i].image + '"/> <strong><font color="#6600ff">' + users[i].name + '</font><font color="#ff0000">  saiu da sala. </font></strong>';
				lost = users[i].name;
				users.splice(i, 1);
      	  		break;
			}
		}
		// envia a mensagem
		io.emit('chat message', msg);
	});
});
