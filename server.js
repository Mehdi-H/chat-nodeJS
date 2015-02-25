/* 
* @Author: mehdi
* @Date:   2015-02-18 11:30:46
* @Last Modified by:   mehdi
* @Last Modified time: 2015-02-18 15:47:21
*/

/*jslint node: true */
'use strict';

var http = require('http');
// var mustache = require('mustache');
var md5 = require('MD5');

var httpServer = http.createServer(function(req, res){
	console.log('message');
});

httpServer.listen('1337');

var io = require('socket.io').listen(httpServer);
var users = {};
var messages = [];
var history = 6;

io.sockets.on('connection', function(socket){
	console.log('nouvel utilisateur');

	var me = false;

	for(var k in users){
		socket.emit('newuser', users[k]);
	}
	for(var k in messages){
		socket.emit('newmsg', messages[k]);
	}

	/** réception msg */
	socket.on('newmsg', function(message){
		message.user = me;
		var date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
		messages.push(message);
		if(messages.length > history){
			messages.shift();
		}
		io.sockets.emit('newmsg', message);
	});

	/** A la connexion d'un utilisateur */
	socket.on('login', function(user){
		// console.log(user);
		me = user;
		me.id = user.mail.replace('@','-').replace('.','-');
		me.avatar = 'https://gravatar.com/avatar/' + md5(user.mail) + '?s=50';
		socket.emit('logged');
		users[me.id] = me;
		socket.broadcast.emit('newuser', me);
	});

	/** A sa deconnexion */
	socket.on('disconnect', function(){
		if(!me){
			return false;
		}
		delete users[me.id];
		io.sockets.emit('disuser', me);
	});
});