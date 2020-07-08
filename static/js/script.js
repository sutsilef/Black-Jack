
let blackjackGame = {
     'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
     'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
     'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
     'cardsMap':{'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'J':10, 'Q':10, 'A':[1, 11]},
     'wins':0,
     'losses':0,
     'draws':0,
     'isStand': false,
     'turnsOver': false,
};
 const YOU = blackjackGame['you']
 const DEALER = blackjackGame['dealer']

 const HitSound = new Audio('static/sounds/swish.m4a');
 const Winsound = new Audio('static/sounds/cash.mp3');
 const Losssound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);


function blackjackHit(){
     if(blackjackGame['isStand']=== false){
          let card = randomCard();
          showCard(card, YOU);
          updateScore(card, YOU);
          showScore(YOU);
     }
}
//randomy picks a card
function randomCard() {
     let randomIndex = Math.floor(Math.random() * 13);
     return blackjackGame['cards'][randomIndex];
}
//shows the cards
function showCard(card, activePlayer){
     if(activePlayer['score'] <= 21){
     let cardImage = document.createElement('img'); //creates an image
     cardImage.src =`static/img/bj/${card}.png`; //image source
     document.querySelector(activePlayer['div']).appendChild(cardImage); //appends the image to the div YOU
     HitSound.play();
     }
}
//deal function
function blackjackDeal() {
     if (blackjackGame['turnsOver'] === true){

          blackjackGame['isStand'] = false;
          let yourImages = document.querySelector('#your-box').querySelectorAll('img');
          let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
     //logic on removing the cards
          for (i=0; i< yourImages.length; i++){
               yourImages[i].remove();
          }
          for (i=0; i< dealerImages.length; i++){
               dealerImages[i].remove();
          }
          //scorecard goes back to zero-resets everything back to default
          YOU['score'] = 0;
          DEALER['score'] = 0;
          document.querySelector('#your-blackjack-result').textContent = 0;
          document.querySelector('#dealer-blackjack-result').textContent = 0;

          document.querySelector('#your-blackjack-result').style.color = '#ffffff';
          document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';
          
          document.querySelector('#blackjack-result').textContent = "Let's Play";
          document.querySelector('#blackjack-result').style.color = 'black';
          blackjackGame['turnsOver'] = true;
     }
}

//TAKING SCORE
function updateScore(card, activePlayer){
     if(card === 'A'){
     //if adding 11 keeps me below 21,add 11,Otherwise, add 1
     if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <=21){
          activePlayer['score'] += blackjackGame['cardsMap'][card][1];
     }else{
          activePlayer['score'] += blackjackGame['cardsMap'][card][0];
     }

     } else{
     activePlayer['score'] += blackjackGame['cardsMap'][card];
     }
}

//bust logic when cards exceed 21
function showScore(activePlayer){
     if(activePlayer['score'] > 21){
          document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
          document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
     }else {
     document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
     }
}
function sleep(ms){
     return new Promise(resolve => setTimeout(resolve, ms));
}

//adding a second player
async function dealerLogic(){
     blackjackGame['isStand'] = true;

     while(DEALER['score'] <16 && blackjackGame['isStand'] === true){
          let card = randomCard();
          showCard(card, DEALER);
          updateScore(card, DEALER);
          showScore(DEALER);
          await sleep(1000);
     }   

     blackjackGame['turnsOver'] = true;
     let winner =  computeWinner();
     showResult(winner); 
}
//compute winner and return who won the game
//update the wins, draws and losses
function computeWinner(){
     let winner;

     if (YOU['score'] <= 21){
          //condition :higher score than dealers or when dealer busts but you are 21 or under
          if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)){
               blackjackGame['wins']++;
               winner = YOU;

          }else if(YOU['score'] < DEALER['score']) {
               blackjackGame['losses']++;
               winner = DEALER

          }else if(YOU['score'] === DEALER['score']){
               blackjackGame['draws']++;
          }
          
          //condition: when user busts but dealer doesnt
          }else if(YOU['score'] >21 && DEALER['score'] <=21){
               blackjackGame['losses']++;
               winner = DEALER;

          //condition: when you AND the delaer busts
          }else if(YOU['score']> 21 && DEALER['score']> 21){
               blackjackGame['draws']++;
          }

          console.log(blackjackGame);
          return winner;
}  
function showResult(winner)  {
     let message, messageColor;

     if(blackjackGame['turnsOver'] === true){

          if (winner === YOU){
               document.querySelector('#wins').textContent = blackjackGame['wins'];
               message = 'You Won!';
               messageColor = 'green';
               Winsound.play();
          }else if(winner === DEALER){
               document.querySelector('#losses').textContent = blackjackGame['losses'];
               message = 'You Lost!';
               messageColor = 'red';
               Losssound.play();
          } else{
               document.querySelector('#draws').textContent = blackjackGame['draws'];
               message = 'You Drew!';
               messageColor = 'black';
          }
          document.querySelector('#blackjack-result').textContent = message;
          document.querySelector('#blackjack-result').style.color = messageColor;
     }
}






