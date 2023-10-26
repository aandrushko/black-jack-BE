const {
    getShuffledCards,
    getCardScore,
    isPlayerHandBust,
    isDealerHandBust,
    getDealersHandSafe,
    getDealersHandOpened,
    hasDealerCompleteHand,
    formFinalResult,
    getTheFinalPlayerScoreToCompare,
    dealTwoCardsForDealerAndPlayer,
    dealCardForPerson,
} = require('../services/cardsService');

const { CARDS } = require('../constants/constants')

test('getShuffledCards should return 52 cards', () => {
    const cards = getShuffledCards(CARDS);
    expect(cards.length).toBe(52);
});

test('getCardScore should return correct score', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 8},
        {name: '9', type: 'spades', value: 9},
    ];
    expect(getCardScore(cards)).toBe(24);
});

test('isPlayerHandBust should return true if score is more than 21', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 8},
        {name: '9', type: 'spades', value: 9},
    ];
    expect(isPlayerHandBust(cards)).toBe(true);
});

test('isPlayerHandBust should return false if score is less than 21', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 8},
    ];
    expect(isPlayerHandBust(cards)).toBe(false);
});

test('isDealerHandBust should return true if score is more than 21', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 8},
        {name: '9', type: 'spades', value: 9},
    ];
    expect(isDealerHandBust(cards)).toBe(true);
});

test('isDealerHandBust should return false if score is less than 21', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 8},
    ];
    expect(isDealerHandBust(cards)).toBe(false);
});

test('getDealersHandSafe should return only visible cards', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7, isHidden: true},
        {name: '8', type: 'spades', value: 8, isHidden: false},
        {name: '9', type: 'spades', value: 9, isHidden: false},
    ];
    expect(getDealersHandSafe(cards).length).toBe(2);
});

test('getDealersHandOpened should return opened hand, all cards hidden and visible', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7, isHidden: true},
        {name: '8', type: 'spades', value: 8, isHidden: false},
        {name: '9', type: 'spades', value: 9, isHidden: false},
    ];
    expect(getDealersHandOpened(cards).length).toBe(3);
});

test('hasDealerCompleteHand should return true if dealer has 17 or more', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7, isHidden: true},
        {name: '8', type: 'spades', value: 8, isHidden: false},
        {name: '9', type: 'spades', value: 9, isHidden: false},
    ];
    expect(hasDealerCompleteHand(cards)).toBe(true);
});

test('hasDealerCompleteHand should return false if dealer has less than 17 in score', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7, isHidden: true},
        {name: '8', type: 'spades', value: 8, isHidden: false},
    ];
    expect(hasDealerCompleteHand(cards)).toBe(false);
});

test('formFinalResult should filter and return correct result for respose', () => {
    const gameData = {
        dealerHand: [
            {name: '7', type: 'spades', value: 7, isHidden: true},
        ],
        playerHand: [
            {name: '7', type: 'spades', value: 7},
        ],
        gameStatus: {
            isFinished: true,
            isPlayerWin: true,
        },
        cardsDeck: [
            {name: '7', type: 'spades', value: 7},
            {name: '8', type: 'spades', value: 8},
        ],
        createdAt: '2021-10-10T10:10:10.000Z',
        updatedAt: '2021-10-10T10:10:10.000Z',
    };
    expect(formFinalResult(gameData)).toEqual({
        dealerHand: [
            {name: '7', type: 'spades', value: 7, isHidden: true},
        ],
        playerHand: [
            {name: '7', type: 'spades', value: 7},

        ],
        gameStatus: {
            isFinished: true,
            isPlayerWin: true,
        },
    });
});

test('getTheFinalPlayerScoreToCompare should the best score to avoid busting, making decision to treat ace as 1', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 8},
        {name: 'Ace', type: 'spades', value: 11},
    ];
    expect(getTheFinalPlayerScoreToCompare(cards)).toBe(16);
});

test('getTheFinalPlayerScoreToCompare should return the best score option to avoid busting, making decision to treat one ace as 11', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 2},
        {name: 'Ace', type: 'spades', value: 11},
    ];
    expect(getTheFinalPlayerScoreToCompare(cards)).toBe(20);
});

test('getTheFinalPlayerScoreToCompare should return the best score option to avoid busting, making decision to treat one ace as 11 and another as 1', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 2},
        {name: 'Ace', type: 'spades', value: 11},
        {name: 'Ace', type: 'spades', value: 11},
    ];
    expect(getTheFinalPlayerScoreToCompare(cards)).toBe(21);
});

test( 'dealCardForPerson should return correct result', () => {
    const cards = [
        {name: '7', type: 'spades', value: 7},
        {name: '8', type: 'spades', value: 2},
        {name: 'Ace', type: 'spades', value: 11},
        {name: 'Ace', type: 'spades', value: 11},
    ];
    const { personsHandWithNewCard, restCardsInDeck } = dealCardForPerson(cards, cards);
    expect(personsHandWithNewCard.length).toBe(5);
    expect(restCardsInDeck.length).toBe(3);
});

test( 'dealTwoCardsForDealerAndPlayer should return correct result', () => {
    const { dealerHand, playerHand, cardsInDeck } = dealTwoCardsForDealerAndPlayer();
    expect(dealerHand.length).toBe(2);
    expect(playerHand.length).toBe(2);
});

test( 'dealTwoCardsForDealerAndPlayer should deal only 4 cards and the rest of deck should be equel 48', () => {
    const { cardsInDeck } = dealTwoCardsForDealerAndPlayer();
    expect(cardsInDeck.length).toBe(48);
});
