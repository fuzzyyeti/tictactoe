import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import time
from itertools import cycle
import numpy as np

class Game(object):
    def __init__(self):
        self.board = np.array([[None]*3 for x in range(3)])
        self.current_player_cycle = cycle(('x','o'))
        self.current_player = 'o'
    @staticmethod
    def make_serializable(nparray):
        return tuple([tuple(x) for x in nparray])
    def move(self,position):
        print "moving"
        print self.board
        if self.board[int(position[0])][int(position[1])]:
            return {'sate':'game','game_state':'invalid','board':self.make_serializable(self.board)}
        else:
            self.current_player = self.current_player_cycle.next() 
            next_player_status = 'o_turn' if self.current_player == 'x' else 'x_turn'
            self.board[int(position[0])][int(position[1])] = self.current_player
            winner = self.check_win()
            status = winner if winner else next_player_status 
            return {'state':'game','game_state':status,'board':self.make_serializable(self.board)}
    def check_win(self):
        x = np.array(['x','x','x'])
        o = np.array(['o','o','o'])
        #Check if X won
        if (self.board.diagonal() == x).all():
            return 'x'
        if (np.rot90(self.board).diagonal() == x).all():
            return 'x'
        for row in self.board:
            if (row == x).all(): 
              return 'x'
        for col in self.board.T:
            if (col == x).all(): 
              return 'x'
        #Check if O won
        if (self.board.diagonal() == o).all():
            return 'o'
        if (np.rot90(self.board).diagonal() == o).all():
            return 'o'
        for row in self.board:
            if (row == o).all(): 
              return 'o'
        for col in self.board.T:
            if (col == o).all(): 
              return 'o'
        if not None in list(self.board.ravel()):
            return 'stalemate'
        return None
                

            
        
    


class GameWebSocket(tornado.websocket.WebSocketHandler):
    game = Game()
    connections = []
    def __init__(self,*args,**kwargs):
        tornado.websocket.WebSocketHandler.__init__(self,*args,**kwargs)
        self.player = None
    def open(self): 
        print("WebSocket opened")
        GameWebSocket.connections.append(self)
        self.update_state()    
    @classmethod
    def update_state(cls):
        players = [x.player for x in cls.connections]
        print players
        if players:
            if (len(players) > 2) and ('x' in players) and ('o' in players):
                for x in cls.connections: 
                    if not x.player:
                        x.write_message({'state':'wait'})
            if (not 'x' in players) and (not 'o' in players):
                print 'In 1'
                cls.connections[0].player = 'x'
                cls.connections[0].write_message({'state':'on_deck'})
            elif not 'x' in players:
                print 'In 2'
                for x in cls.connections: 
                    if not x.player:
                        x.player = 'x'
                        x.write_message({'state':'game','game_state':'x_turn','player':'x'})
                cls.connections[players.index('o')].write_message({'state':'game','game_state':'x_turn','player':'o'})
            elif not 'o' in players:
                print 'In 3'
                for x in cls.connections: 
                    if not x.player:
                        x.player = 'o'
                        x.write_message({'state':'game','game_state':'x_turn','player':'o'})
                cls.connections[players.index('x')].write_message({'state':'game','game_state':'x_turn','player':'x'})
            elif ('x' in players) and ('o' in players):
                print 'creating a new game and sending the announcement'
                GameWebSocket.game = Game()
                cls.connections[players.index('x')].write_message({'state':'game',
                        'game_state':'x_turn',
                        'player':'x',
                        'board':GameWebSocket.game.make_serializable(GameWebSocket.game.board)})
                cls.connections[players.index('o')].write_message({'state':'game',
                       'game_state':'x_turn',
                       'player':'o',
                       'board':GameWebSocket.game.make_serializable(GameWebSocket.game.board)})
            else:
                for x in cls.connections: 
                    if not x.player:
                        x.write_message({'state':'wait'})
        print 'Leaving update state'
    def on_message(self, message):
        print 'message is'
        print message
        gws = GameWebSocket.game
        message = json.loads(message)
        if self.player == 'o':
            print 'O is trying making a move'
            print message['move']
            if gws.current_player == 'x':
                info = gws.move(message['move'])
            else:
                info = {'player':'o','state':'game','game_state':'invalid','board':gws.make_serializable(gws.board)}
        if self.player == 'x':
            print 'X is trying making a move'
            print message['move']
            if gws.current_player == 'o':
                info = gws.move(message['move'])
            else:
                info = {'player':'x','state':'game','game_state':'invalid','board':gws.make_serializable(gws.board)}
       # print 'player = {}'.format(self.player)
       # print 'turn = {}'.format(gws.current_player)
       # info = gws.move(message['move'])
        info['player'] = 'x'
        self.find_player('x').write_message(info)
        info['player'] = 'o'
        self.find_player('o').write_message(info)
        if (info['game_state'] == 'x' or info['game_state'] == 'o' or info['game_state'] == 'stalemate'):
       # display "won" message for 3 seconds
            time.sleep(3)
            print "I should be restarting now!"
            self.update_state()

    def find_player(self,letter):
        players = [x.player for x in GameWebSocket.connections]
        
        try: 
            return GameWebSocket.connections[players.index(letter)]
        except ValueError:
            return None
    def on_close(self):
        print 'websocket close'
        print self.player
        if self.player == 'o':
            print 'reseting board'
            GameWebSocket.game = Game()
            print 'deleting o'
            if self.find_player('x'):
                print 'o forfeits'
                self.find_player('x').write_message({'state':'won'})
                self.find_player('x').player = None;
                #Allow forfeit message display for 3 seconds
                time.sleep(3)
        if self.player == 'x':
            print 'reseting board'
            GameWebSocket.game = Game()
            print 'deleting x'
            if self.find_player('o'):
                print 'x forfeits'
                self.find_player('o').write_message({'state':'won'})
                self.find_player('o').player = None;
                #Allow forfeit message display for 3 seconds
                time.sleep(3)
        for i, x in enumerate(GameWebSocket.connections):
            if self == x:
                print 'deleting it'
                del(GameWebSocket.connections[i])
        self.update_state()
            
class RedirectHandler(tornado.web.RequestHandler):
	def get(self):
		self.redirect(r'index.html')	
#		self.write('redirect')

if __name__ == "__main__":
    game = Game() 
    connections = []
    application = tornado.web.Application([
                (r"/websocket", GameWebSocket),
                (r"/", RedirectHandler),
                (r"/(.*)", tornado.web.StaticFileHandler, {'path':r'./public'})
    ])
    application.listen(8888)
    tornado.ioloop.IOLoop.current().start()
