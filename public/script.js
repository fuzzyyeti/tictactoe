
ws = (function() {
  //Pages for each game state
  var state = ['on_deck', 'game', 'wait','won'];
  var clear_all = function(){
    state.forEach(function(state){
      console.log(state);
      if(document.getElementById(state).className != 'hide')
      {
        document.getElementById(state).className += 'hide';
      }
    });
  };

  var set_state = function(name){
    clear_all();
    document.getElementById(name).className =
      document.getElementById(name).className.replace
      ( /(?:^|\s)hide(?!\S)/g , '' );
  };

    
  

  var elm = document.getElementById('main');
  //Set up web socket
  var ws = new WebSocket("ws://localhost:8888/websocket");
  ws.onmessage = function (evt) {
    data = JSON.parse(evt.data)
    //The overall page state is set by the state property on a WS message
    if ('state' in data) {
       console.log(data)
       set_state(data.state);
    //The whole state of the game is restored from a JSON object
       if (data.state == 'game'){
          //Set The player name
          if (data.player == 'x')
          {
            document.getElementById('player').innerHTML = "You are player X";   
          }
          if (data.player == 'o')
          {
            document.getElementById('player').innerHTML = "You are player O";   
          }
          if (data.game_state == 'x_turn')
          {
            document.getElementById('game_state').innerHTML = "It's X's turn";   
          }
          if (data.game_state == 'o_turn')
          {
            document.getElementById('game_state').innerHTML = "It's O's turn";   
          }
          if (data.game_state == 'x')
          {
            document.getElementById('game_state').innerHTML = "X Wins!";   
          }
          if (data.game_state == 'o')
          {
            document.getElementById('game_state').innerHTML = "O Wins!";   
          }
          if (data.game_state == 'stalemate')
          {
            document.getElementById('game_state').innerHTML = "Stalemate!";   
          }
          
          //Update the board
          if('board' in data){
            update_board(data.board);
          }
       };
    };
  };
  return ws;
})();

var move = function(value){
    console.log('sending json now');
    ws.send(JSON.stringify({move:value}))
};

var update_board = function(board){
  for (var i = 0; i < 3;i++){
    for (var j = 0; j < 3; j++){
      var index = i.toString() + j.toString()
      document.getElementById(index).innerHTML = board[i][j]  
    }
  }
}

for (var i = 0; i < 3;i++){
  console.log('test2'); 
  for (var j = 0; j < 3; j++){
    var index = i.toString() + j.toString()
    console.log(index); 
    console.log('test3'); 
    (function(index){
      document.getElementById(index).addEventListener('click',function(){
        console.log(index); 
        move(index.toString());
      });
    })(index);
  }
}


