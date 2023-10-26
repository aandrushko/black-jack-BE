
const Game = require('../models/gameModel');
const {CARDS} = require('../constants/constants')

const {
    getCardScore,
    isPlayerHandBust,
    isDealerHandBust,
    getDealersHandSafe,
    getDealersHandOpened,
    hasDealerCompleteHand,
    formFinalResult,
    getTheFinalPlayerScoreToCompare,
    getShuffledCards

} = require('../services/cardsService');

const submit_player_hit = async (req, res) => {
    try {
        // get Game state
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        const [newCardForPlayer, ...restCardsInDeck] = game.cardsInDeck;

        if (game.gameStatus.isFinished) {
            return res.status(400).json({
                message: 'Game already finished'
            });
            
        }
        // hit one card for player from the deck
        await Game.findByIdAndUpdate(gameId, {
            playerHand: [...game.playerHand, newCardForPlayer],
            cardsInDeck: restCardsInDeck
        });
        
        // get Game state ufter card was taken by player
        const result = await Game.findById(gameId);

        // check did user won or bust
        const playerIsBust = isPlayerHandBust(result.playerHand);
        const isPlayerCollectBJ = getCardScore(result.playerHand) === 21;       
        if (playerIsBust) {
            await Game.findByIdAndUpdate(gameId,
                {
                    dealerHand: getDealersHandOpened(result.dealerHand),
                    playerHand: result.playerHand,
                    gameStatus: {
                        isFinished: true,
                        isPlayerWin:false,
                    }

                }
            )
            const finalGameResult = await Game.findById(gameId);
            res.json(formFinalResult(finalGameResult));
            return;
        }
        if(isPlayerCollectBJ) {
            await Game.findByIdAndUpdate(gameId,
                {
                    dealerHand: getDealersHandOpened(result.dealerHand),
                    playerHand: result.playerHand,
                    gameStatus: {
                        isFinished: true,
                        isPlayerWin:true,
                    }

                }
            )
            const finalGameResult = await Game.findById(gameId);
            res.json(formFinalResult(finalGameResult))
            return;
        }

        return res.json(
            {
                playerHand: result.playerHand,
                dealerHand: getDealersHandSafe(result.dealerHand),
            }
        );
    }
    catch (e) {
      res.status(500).json({
        message: e?.message || 'Something went wrong'
      });
    }
   
};

const submit_dealer_hit = async (req, res) => {
    try {
        // get Game state
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        const [newCardForToDeal, ...restCardsInDeck] = game.cardsInDeck;

        if (game.gameStatus.isFinished) {
            return res.status(400).json({
                message: 'Game already finished'
            });
            
        }
        // hit one card for dealer from the deck
        await Game.findByIdAndUpdate(gameId, {
            dealerHand: [...game.dealerHand, newCardForToDeal],
            cardsInDeck: restCardsInDeck
        });
        
        // get Game state after card was taken by dealer
        const result = await Game.findById(gameId);
       
        // check did dealer bust
        const dealerIsBust = isDealerHandBust(result.dealerHand);
        // Declare Player as a winner and end game
        if (dealerIsBust) {
            await Game.findByIdAndUpdate(gameId,
                {
                    dealerHand: getDealersHandOpened(result.dealerHand),
                    playerHand: result.playerHand,
                    gameStatus: {
                        isFinished: true,
                        isPlayerWin:true,
                    }

                }
            )
            const finalGameResult = await Game.findById(gameId);
            res.json(formFinalResult(finalGameResult))
            return;
        }

         //Check do dealer need more cards to have min score 17+         
         const isDealerCompleteHand = hasDealerCompleteHand(result.dealerHand);
         if(isDealerCompleteHand){
             const dealerScore = getCardScore(result.dealerHand);
             const playerScore = getTheFinalPlayerScoreToCompare(result.playerHand);
             await Game.findByIdAndUpdate(gameId, {
                 dealerHand: getDealersHandOpened(result.dealerHand),
                 playerHand: result.playerHand,
                 gameStatus: {
                     isFinished: true,
                     isPlayerWin: dealerScore < playerScore,
                 }
             });
             const finalGameResult = await Game.findById(gameId);
             res.json(finalGameResult)
             return;
         }         
        
        return res.json(
            {
                playerHand: result.playerHand,
                dealerHand: getDealersHandOpened(result.dealerHand),
            }
        );       
    }
    catch (e) {
      res.status(500).json({
        message: e?.message || 'Something went wrong'
      });
    }
   
};

const submit_player_stay = async (req,res) => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        const dealerScore = getCardScore(game.dealerHand);
        const playerScore = getTheFinalPlayerScoreToCompare(game.playerHand);
        const isDealerCompleteHand = hasDealerCompleteHand(game.dealerHand);
        
        // Finished game should not be accessible.
        if (game.gameStatus.isFinished) {
            return res.status(400).json({
                message: 'Game already finished'
            });            
        }

        // submiting final result, since dealer hand complete
        if (isDealerCompleteHand) {
            const dealerIsBust = isDealerHandBust(game.dealerHand);
            await Game.findByIdAndUpdate(gameId, {
                dealerHand: getDealersHandOpened(game.dealerHand),
                playerHand: game.playerHand,
                gameStatus: {
                    isFinished: true,
                    isPlayerWin: dealerIsBust || dealerScore < playerScore,
                }
            });
            const finalGameResult = await Game.findById(gameId);
            res.json(formFinalResult(finalGameResult))
            return;       
        }
        await Game.findByIdAndUpdate(gameId, {
            dealerHand: getDealersHandOpened(game.dealerHand),
            playerHand: game.playerHand,
        });

        const finalGameResult = await Game.findById(gameId);
        res.json({
            dealerHand: getDealersHandOpened(finalGameResult.dealerHand),
            playerHand: finalGameResult.playerHand,
        }); 
             
    }
    catch (e) {
      res.status(500).json({
        message: e?.message || 'Something went wrong'
      });
    }
};

const get_game_details = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        if (game) {
            res.json({
                playerHand: game.playerHand,
                dealerHand: getDealersHandSafe(game.dealerHand),
                gameStatus: game.gameStatus
            })
        }
    } catch(e) {
        res.status(400).json({
            message: 'Game id is not valid'
        })
    }
}

const start_new_game = async (req, res) => {
    const shuffledDeck = getShuffledCards(CARDS);   
    const dealerHand = [
      {
        ...shuffledDeck[0],
        isHidden: false,
     },
     {
        ...shuffledDeck[2],
        isHidden: true,
     }
    ];
    const playerHand = [
        {
            ...shuffledDeck[1],            
         },
         {
            ...shuffledDeck[3],           
         }
    ]
    const cardsInDeck = shuffledDeck.slice(4);

    try {
        const game = new Game({
            gameStatus: {
                isFinished: false,
            },
            dealerHand,
            playerHand,
            cardsInDeck,
        });   
        const result = await game.save();
        if (result){
            res.status(200).json(
                {
                    playerHand: result.playerHand,
                    dealerHand: result.dealerHand.filter(card => !card.isHidden),
                    createdAt: result.createdAt,
                    gameId: result._id
                }
            )
        }
    } catch (e) {
        console.log(e)
    }
}
module.exports = {
    submit_player_stay,
    submit_player_hit,
    submit_dealer_hit,
    get_game_details,
    start_new_game,
}