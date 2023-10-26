🚀 Get Ready to start Black Jack Back-End Service.

Welcome to the world of Black Jack! This Back-End service powers your gaming app, connecting it seamlessly to a robust MongoDB database. To start your local server and unleash the magic, follow these simple steps:

 - Download repo running in terminal command: `git clone https://github.com/aandrushko/black-jack-BE.git` <br/>
 
 - Go to the project folder: `cd black-jack-BE`  <br/>
 
 - install dependencies: `npm install` <br/>
 
 - Launch your local server and let the games begin with: `npm run start` <br/>
 
 - If you have installed `nodemon` and want to contribute => `npm run start:dev` <br/> (nodemon will watch your changes and rebuild the app for you) <br/>
 
 - To run tests, use the command: `npm test`. <br/>

<em>Your Black Jack Back-End is now alive, ready to serve your gaming app and communicate with the powerful MongoDB. <em/> <br/>

Now jump to the <a href='https://github.com/aandrushko/black-jack-FE'>FE part</a> of this game, and follow the instructions in it. <br/>

**Briefly about how it works**

API contains 5 endpoints

**1. start_new_game** - hitting it user creates a new game table with basic properties in it (see `./models/gameModel.js` ).

Also in this endpoint dealer shuffles the card deck and deals the first cards for the player and dealer. Order matters. 

So the first and the third card goes to the dealer, and the second and fourth cards go to the player's hand. (see `./services/cardService.js` func `dealTwoCardsForDealerAndPlayer`)

**2. submit_player_hit** - hitting this one, the player asks for an extra card. 

The service also updates the game state according to changes the new card can bring to the game. (see `./services/cardService.js` -- `isPlayerHandBust, dealCardForPerson, getCardScore`).

**3. submit_dealer_hit** - pretty similar to the previous one but for the dealer. 

This endpoint is hitting when the dealer opens the hand and figures out that his hand is lower 17 or is "Soft 17".
To continue the round dealer needs to take extra cards until his score is 17 or more. (see `./services/cardService.js` -- `hasDealerCompleteHand, isDealerHandBust`)

**4. submit_player_stay** - this endpoint reveals the dealer's hand and does a couple of checks for dealer bust/dealer low hand / compare score / declare winner. 

Service also scores aces with check for the best possible score to avoid a bust. (see `./services/cardService.js` -- `getTheFinalPlayerScoreToCompare`)

**5.  get_game_details** - the name says about it's nature. During the round, we need to know how each event affects the game state.


See the flow chart to have a better understanding of BS
[Game schema pdf](https://github.com/aandrushko/black-jack-BE/files/13182195/Flowchart.pdf)


🃏 Get Your Game On!
