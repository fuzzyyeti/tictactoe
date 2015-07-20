import unittest
import tictactoe
import numpy as np


class TestMain(unittest.TestCase):
    def setUp(self):
        self.game = tictactoe.Game() 
    def test_board(self):
        self.assertTrue((self.game.board == np.array(((None,None,None),
                                (None,None,None),
                                (None,None,None)))).all())
    def test_move(self):
        #Make first move in the top left
        results = self.game.move('00')
        self.assertEqual(results['game_state'],'o_turn') 
        self.assertTrue(results['board'] == (('x',None,None),
                                (None,None,None),
                                (None,None,None)))
        #Return false for duplicate move
        results = self.game.move('00')
        self.assertEqual(results['game_state'],'invalid') 
        self.assertTrue(results['board'] == (('x',None,None),
                                (None,None,None),
                                (None,None,None)))
        #Make second move in center
        results = self.game.move('11')
        self.assertEqual(results['game_state'],'x_turn')
        self.assertTrue(results['board'] == (('x',None,None),
                                (None,'o',None),
                                (None,None,None)))
    def test_x_win(self):
        #diagonal
        game = tictactoe.Game() 
        game.move('00')
        game.move('10')
        game.move('11')
        game.move('20')
        results = game.move('22')
        self.assertEqual(results['game_state'],'x') 
        #middle
        game = tictactoe.Game() 
        game.move('01')
        game.move('10')
        game.move('11')
        game.move('20')
        results = game.move('21')
        self.assertEqual(results['game_state'],'x') 
        #side
        game = tictactoe.Game() 
        game.move('00')
        game.move('11')
        game.move('10')
        game.move('21')
        results = game.move('20')
        self.assertEqual(results['game_state'],'x') 
    def test_o_win(self):
        #diagonal
        game = tictactoe.Game() 
        game.move('02')
        game.move('00')
        game.move('10')
        game.move('11')
        game.move('20')
        results = game.move('22')
        self.assertEqual(results['game_state'],'o') 
        #middle
        game = tictactoe.Game() 
        game.move('02')
        game.move('01')
        game.move('10')
        game.move('11')
        game.move('20')
        results = game.move('21')
        self.assertEqual(results['game_state'],'o') 
        #side
        game = tictactoe.Game() 
        game.move('02')
        game.move('00')
        game.move('11')
        game.move('10')
        game.move('21')
        results = game.move('20')
        self.assertEqual(results['game_state'],'o') 
    def test_stalemate(self):
        self.game.move('00')
        self.game.move('01')
        self.game.move('02')
        self.game.move('11')
        self.game.move('21')
        self.game.move('12')
        self.game.move('10')
        self.game.move('20')
        results = self.game.move('22')
        self.assertEqual(results['game_state'],'stalemate') 

if __name__ == '__main__':
    unittest.main()

