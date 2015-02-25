/* 
* @Author: mehdi
* @Date:   2015-02-18 11:55:35
* @Last Modified by:   mehdi
* @Last Modified time: 2015-02-18 16:04:52
*/

/*jslint node: true */
// 'use strict';

(function($){
	var socket = io.connect('http://localhost:1337');
	var msgtpl = $('#msgtpl').html();
	var lastmsg = false;

	$('#msgtpl').remove();

	$('#loginform').submit(function(event){
		event.preventDefault();

		socket.emit('login', {
			username : $('#username').val(),
			mail     : $('#mail').val()
		});
	});

	socket.on('logged', function(){
		$('#login').fadeOut();
		$('#message').focus();
	});

	/** Envoi de messages */
	$('#form').submit(function(event){
		event.preventDefault();
		socket.emit('newmsg', {message : $('#message').val()});
		$('#message').val('');
		$('#message').focus();
	});

	socket.on('newmsg', function(message){
		if(lastmsg != message.user.id){
			$('#messages').append('<div class="sep"></div>');
			lastmsg = message.user.id;
		}
		$('#messages').append('<div class="message">' + Mustache.render(msgtpl, message) + '</div>');
		$('#messages').animate({scrollTop: $('#messages').prop('scrollHeight') }, 500);
	});

	/** Gestion des users connectés */
	socket.on('newuser', function(user){
		$('#users').append('<img src="' + user.avatar + '" id="' + user.id + '" />');
	});

	socket.on('disuser', function(user){
		$('#' + user.id).remove();
	});

})(jQuery);