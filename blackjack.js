function calculatePoints(hand) {
  hand = hand.slice(0);
  function compare(card1, card2) {
    return card2.points - card1.points;
  }
  hand.sort(compare);
  var point = 0;
  for (var i = 0; i < hand.length; i++) {
    var card = hand[i];
    if (card.points >= 10) {
      point += 10;
    } else if (card.points < 10 && card.points > 1) {
      point += card.points;
    } else if (card.points === 1 && point <= 10) {
      point += 11;
    } else if (card.points === 1 && point >= 11) {
      point += 1;
    }
  }
  return point;
}


function newDeck () {
  var deck = [];
  for (var i = 1; i <= 13; i++) {
    var deckObject1 = {
      points: i,
      suit: "spades"
    };
    var deckObject2 = {
      points: i,
      suit: "clubs"
    };
    var deckObject3 = {
      points: i,
      suit: "hearts"
    };
    var deckObject4 = {
      points: i,
      suit: "diamonds"
    };
    deck.push(deckObject1);
    deck.push(deckObject2);
    deck.push(deckObject3);
    deck.push(deckObject4);
  }
  return deck;
}

// var deck = [
//   { point: 9, suit: 'diamonds' },
//   { point: 1, suit: 'spades' },
//   { point: 5, suit: 'clubs' },
//   { point: 9, suit: 'hearts' },
//   { point: 2, suit: 'diamonds' },
//   { point: 10, suit: 'clubs' },
//   { point: 3, suit: 'hearts' },
//   { point: 10, suit: 'spades' }
// ];

var dealerHand = [];
var playerHand = [];

function resetGame() {
  deck = newDeck ();
  dealerHand = [];
  playerHand = [];
  $('#player-points').text('');
  $('#dealer-points').text('');
  $('#messages').text('');
  $('#player-hand').html('');
  $('#dealer-hand').html('');
}
function getCardImageUrl(card) {
  var cardName;
  if (card.points === 1) {
    cardName = 'ace';
  } else if (card.points === 11) {
    cardName = 'jack';
  } else if (card.points === 12) {
    cardName = 'queen';
  } else if (card.points === 13) {
    cardName = 'king';
  } else {
    cardName = card.points;
  }
  return 'images/' + cardName + '_of_' + card.suit + '.svg';
}

function dealCard(hand, element) {
  var idx = Math.floor(Math.random()*deck.length);
  var card = deck[idx]
  deck.splice(idx,1);
  hand.push(card);
  var url = getCardImageUrl(card);
  var cardHTML = '<img class="card" src="' + url + '"/>';
  $(element).append(cardHTML);
}

/*
calculatePoints - takes a hand (array of cards) and returns
the point value of that hand.
*/
// function calculatePoints(hand) {
//   var sum = 0;
//   for (var i = 0; i < hand.length; i++) {
//     var card = hand[i];
//     sum = sum + card.point;
//   }
//   return sum;
// }

/*
displayPoints - calculate the points using calculatePoints for both the dealer and player. And it will update the display with those points #dealer-points and #player-points.
*/
function displayPoints() {
  var dealerPoints = calculatePoints(dealerHand);
  $('#dealer-points').text(dealerPoints);
  var playerPoints = calculatePoints(playerHand);
  $('#player-points').text(playerPoints);
}

/*
checkForBusts - get points using calculatePoints function for both the dealer and player, and display message when someone busts. Returns true if there was a bust, and false otherwise.
*/
function checkForBusts() {
  var playerPoints = calculatePoints(playerHand);
  if (playerPoints > 21) {
    $('#messages').text('You busted. Better luck next time!');
    return true;
  }
  var dealerPoints = calculatePoints(dealerHand);
  if (dealerPoints > 21) {
    $('#messages').text('Dealer busted. You win!');
    return true;
  }
  return false;
}

$(function () {

  $('#deal-button').click(function () {
    resetGame();
    dealCard(playerHand, '#player-hand');
    dealCard(dealerHand, '#dealer-hand');
    dealCard(playerHand, '#player-hand');
    dealCard(dealerHand, '#dealer-hand');
    displayPoints();
    checkForBusts();
  });

  $('#hit-button').click(function () {
    dealCard(playerHand, '#player-hand');
    displayPoints();
    checkForBusts();
  });

  $('#stand-button').click(function () {
    var dealerPoints = calculatePoints(dealerHand);
    while (dealerPoints < 17) {
      dealCard(dealerHand, '#dealer-hand');
      dealerPoints = calculatePoints(dealerHand);
    }
    displayPoints();
    if (!checkForBusts()) {
      // determine the winner
      var playerPoints = calculatePoints(playerHand);
      var dealerPoints = calculatePoints(dealerHand);
      var playerArrayPoints = [];
        for (var i = 0; i < playerHand.length; i++) {
          var playerHandPoints = playerHand.points;
          playerArrayPoints.push(playerHandPoints);
        }
      if (playerPoints > dealerPoints) {
        if (playerArrayPoints[0] > 39 && playerArrayPoints[0] < 44 && playerArrayPoints[1] >= 1 && playerArrayPoints[1] <= 4) {
            $('#messages').text('Winner, Winner, Chicken Dinner!');
        } else if (playerArrayPoints[1] > 39 && playerArrayPoints[1] < 44 && playerArrayPoints[0] >= 1 && playerArrayPoints[0] <= 4) {
          $('#messages').text('Winner, Winner, Chicken Dinner!');
        } else {
            $('#messages').text('You won!');
        }
      } else if (playerPoints === dealerPoints) {
        $('#messages').text('Push');
      } else {
        $('#messages').text('You lose!');
      }
    }
  });
});
