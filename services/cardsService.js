const {CARDS} = require("../constants/constants");

const getShuffledCards = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  const dealTwoCardsForDealerAndPlayer = () => {
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
    const cardsInDeckThatRemaining = shuffledDeck.slice(4);
    return {
      dealerHand,
      playerHand,
      cardsInDeck: cardsInDeckThatRemaining,
    }
  }

  const dealCardForPerson = (personHand, cardsInDeck) => {
    const [newCard, ...restCardsInDeck] = cardsInDeck;
    return {
      personsHandWithNewCard: [...personHand, newCard],
      restCardsInDeck: restCardsInDeck
    }
  }
  const getCardScore = (hand) => {
    const maxScore = hand.reduce((acc,card) => acc + card.value, 0);
    return maxScore;
  }

  const getDealersHandSafe = (hand) => {
    const safeHand = hand
    .filter(card => !card.isHidden)
    .map(({name, type, value}) => ({name, type, value}))
    return safeHand;
  }

  const getDealersHandOpened = (hand) => {
    const openedHand = hand    
    .map(({name, type, value}) => ({name, type, value, isHidden: false }))
    return openedHand;
  }

  //check does hand got bust 
  const isPlayerHandBust = (hand) => {
    const minScore = getCardScore( hand.map( card => card.value > 10 ? ({...card, value: 1}) : card ));
    return minScore > 21;    
  }

  const getTheFinalPlayerScoreToCompare=(hand) => {
      const maxScore = getCardScore(hand);      
      const firstAceIndex = hand.findIndex(card=> card.value === 11); 
      if( maxScore > 21 && firstAceIndex !== -1) {
        const newHand = [...hand];
        newHand[firstAceIndex] = {...hand[firstAceIndex], value: 1};
        return getTheFinalPlayerScoreToCompare(newHand)
      }
      return maxScore;
  }

  const isDealerHandBust = (hand) => {
    const maxScore = getCardScore( hand);
    return maxScore > 21;    
  }
  
  const hasDealerCompleteHand = (hand) => {
    const dealerHasSoft17 = (hand.findIndex(card => card.value === 11) !==-1) && (getCardScore(hand) === 17);
    if(dealerHasSoft17 || (getCardScore(hand) < 17)){
      return false;
    } 
    return true;  
  }

  const formFinalResult = (gameData) => {
    const {dealerHand, playerHand, gameStatus} = gameData;
    return {dealerHand, playerHand, gameStatus};
  }

  module.exports = {
    getShuffledCards,
    dealCardForPerson,
    dealTwoCardsForDealerAndPlayer,
    getCardScore,
    isPlayerHandBust,
    isDealerHandBust,
    getDealersHandSafe,
    getDealersHandOpened,
    hasDealerCompleteHand,
    formFinalResult,
    getTheFinalPlayerScoreToCompare,
  }
