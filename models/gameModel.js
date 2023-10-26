const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    value: {
        type: Number,
    },
}, { _id : false });

const dealerCcardSchema = new Schema({ 
    isHidden: {
        type: Boolean,
    },
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    value: {
        type: Number,
    },
}, { _id : false });
const gameSchema = new Schema({
    gameStatus:{
        isFinished: {
            type: Boolean,
            required: true,
        },
        isPlayerWin: {
            type: Boolean,
        }
    },
    cardsInDeck: [cardSchema],
    dealerHand: [dealerCcardSchema],
    playerHand:[cardSchema]
  
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;