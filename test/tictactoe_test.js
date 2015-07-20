var expect = require("chai").expect;
var fs = require("fs");
var WebSocket = require('ws');
 
describe("Tictactoe Game", function(){
	it('should return state == x if x wins',function(done){
    var ws1 = new WebSocket("ws://localhost:8888/websocket");
    var ws2 = new WebSocket("ws://localhost:8888/websocket");
    var socket_count = 0;
		var ws1_count = 0;
		var ws2_count = 0;
		var close_count = 0;
    ws1.on('message',function(message){
			console.log(message)
			if(ws1_count==0)
			{
				expect(JSON.parse(message)['state']).to.equal('on_deck');	
			}
			if(ws1_count==1)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['player']).to.equal('x');	
				ws1.send(JSON.stringify({move:'00'}));
			}
			if(ws1_count==2)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==3)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
				ws1.send(JSON.stringify({move:'11'}));
			}
			if(ws1_count==4)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==5)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				ws1.send(JSON.stringify({move:'22'}));
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==6)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			console.log('got a message1');
			ws1_count++;
    });
    ws2.on('message',function(message){
			if(ws2_count==0)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			if(ws2_count==1)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
				ws2.send(JSON.stringify({move:'01'}));
			}
			if(ws2_count==2)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			if(ws2_count==3)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
				ws2.send(JSON.stringify({move:'02'}));
			}
			if(ws2_count==4)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			if(ws2_count==5)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			console.log('got a message2');
			ws2_count++;
		});
		ws1.on('close',function(msg){
			console.log('increment close 1');
			close_count++;
		});
		ws2.on('close',function(msg){
			console.log('increment close 2');
			close_count++;
		});
    ws1.on('open',function(msg){
      console.log('open 1');
      socket_count++;
    });
    ws2.on('open',function(msg){
      console.log('open 2');
      socket_count++;
    });
    interval = setInterval(function(){ 
				console.log('ws1');
				console.log(ws1_count);
				console.log('ws2');
				console.log(ws2_count);
				if(ws1_count==7 && ws2_count==6){
						console.log('shutting down');
						ws1.close();
						ws2.close();
						ws1_count++;
						ws2_count++;
				}
        if(close_count == 2){
					console.log('done now');
					done();
					clearInterval(interval);
				}
        if(socket_count == 2){
						console.log('both connected');
						socket_count++;
        }
    },10);
	});
 	it('should return state == x if x makes a move that fills the board and wins',function(done){
    var ws1 = new WebSocket("ws://localhost:8888/websocket");
    var ws2 = new WebSocket("ws://localhost:8888/websocket");
    var socket_count = 0;
		var ws1_count = 0;
		var ws2_count = 0;
		var close_count = 0;
    ws1.on('message',function(message){
			console.log(message)
			if(ws1_count==0)
			{
				expect(JSON.parse(message)['state']).to.equal('on_deck');	
			}
			if(ws1_count==1)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['player']).to.equal('x');	
				ws1.send(JSON.stringify({move:'00'}));
			}
			if(ws1_count==2)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==3)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
				ws1.send(JSON.stringify({move:'22'}));
			}
			if(ws1_count==4)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==5)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				ws1.send(JSON.stringify({move:'02'}));
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==6)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==7)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				ws1.send(JSON.stringify({move:'10'}));
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==8)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==9)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				ws1.send(JSON.stringify({move:'01'}));
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==10)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			console.log('got a message1');
			ws1_count++;
    });
    ws2.on('message',function(message){
			if(ws2_count==0)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			if(ws2_count==1)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
				ws2.send(JSON.stringify({move:'11'}));
			}
			if(ws2_count==2)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			if(ws2_count==3)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
				ws2.send(JSON.stringify({move:'12'}));
			}
			if(ws2_count==4)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			if(ws2_count==5)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
				ws2.send(JSON.stringify({move:'21'}));
			}
			if(ws2_count==6)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			if(ws2_count==7)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('o_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
				ws2.send(JSON.stringify({move:'20'}));
			}
			if(ws2_count==8)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			if(ws2_count==9)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x');	
				expect(JSON.parse(message)['player']).to.equal('o');	
			}
			console.log('got a message2');
			ws2_count++;
		});
		ws1.on('close',function(msg){
			console.log('increment close 1');
			close_count++;
		});
		ws2.on('close',function(msg){
			console.log('increment close 2');
			close_count++;
		});
    ws1.on('open',function(msg){
      console.log('open 1');
      socket_count++;
    });
    ws2.on('open',function(msg){
      console.log('open 2');
      socket_count++;
    });
    var interval = setInterval(function(){ 
				console.log('ws1');
				console.log(ws1_count);
				console.log('ws2');
				console.log(ws2_count);
				if(ws1_count==11 && ws2_count==10){
						console.log('shutting down');
						ws1.close();
						ws2.close();
						ws1_count++;
						ws2_count++;
				}
        if(close_count == 2){
					console.log('done now');
					done();
					clearInterval(interval);
				}
        if(socket_count == 2){
						console.log('both connected');
						socket_count++;
        }
    },10);

  });
  it('should not modify the board if someone goes out of turn',function(done){
    var ws1 = new WebSocket("ws://localhost:8888/websocket");
    var ws2 = new WebSocket("ws://localhost:8888/websocket");
    var socket_count = 0;
		var ws1_count = 0;
		var ws2_count = 0;
		var close_count = 0;
    ws1.on('message',function(message){
			console.log(message)
			if(ws1_count==0)
			{
				expect(JSON.parse(message)['state']).to.equal('on_deck');	
			}
			if(ws1_count==1)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('x');	
			}
			if(ws1_count==2)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('invalid');	
				expect(JSON.parse(message)['player']).to.equal('x');	
				expect(JSON.parse(message)['board'][0][0]).to.equal(null);
			}
			console.log('got a message1');
			ws1_count++;
    });
    ws2.on('message',function(message){
			if(ws2_count==0)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('x_turn');	
				expect(JSON.parse(message)['player']).to.equal('o');	
				ws2.send(JSON.stringify({move:'00'}));
			}
			if(ws2_count==1)
			{
				expect(JSON.parse(message)['state']).to.equal('game');	
				expect(JSON.parse(message)['game_state']).to.equal('invalid');	
				expect(JSON.parse(message)['player']).to.equal('o');	
				expect(JSON.parse(message)['board'][0][0]).to.equal(null);
			}
			console.log('got a message2');
			ws2_count++;
		});
		ws1.on('close',function(msg){
			console.log('increment close 1');
			close_count++;
		});
		ws2.on('close',function(msg){
			console.log('increment close 2');
			close_count++;
		});
    ws1.on('open',function(msg){
      console.log('open 1');
      socket_count++;
    });
    ws2.on('open',function(msg){
      console.log('open 2');
      socket_count++;
    });
    interval = setInterval(function(){ 
				console.log('ws1');
				console.log(ws1_count);
				console.log('ws2');
				console.log(ws2_count);
				if(ws1_count==3 && ws2_count==2){
						console.log('shutting down');
						ws1.close();
						ws2.close();
						ws1_count++;
						ws2_count++;
				}
        if(close_count == 2){
					console.log('done now');
					done();
					clearInterval(interval);
				}
        if(socket_count == 2){
						console.log('both connected');
						socket_count++;
        }
    },10);
	});
});
