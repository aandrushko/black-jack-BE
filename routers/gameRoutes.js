const express = require('express');
const gameController = require('../controllers/gameController')

const router = express.Router();

router.get('/start', gameController.start_new_game);

router.get('/:gameId/hit', gameController.submit_player_hit);

router.get('/:gameId/stay', gameController.submit_player_stay);

router.get('/:gameId/d-hit', gameController.submit_dealer_hit);

router.get('/:gameId', gameController.get_game_details)

module.exports = router;