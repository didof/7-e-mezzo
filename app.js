let deck = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
];

let players = [
    playerOne = [],
    playerTwo = []
];
let newCard;
let turn = 0;

function pickCard() {
    let suit = Math.floor(Math.random() * (deck.length - 1) + 1);
    let card = Math.floor(Math.random() * (deck[suit].length - 1) + 1);
    return deck[suit].splice(card, 1);
}

function showData() {
    console.log(deck);
    console.log(players);
}

function init() {
    // ogni giocatore riceve una carta (hidden) (2 giocatori)
    for (var i = 0; i < players.length; i++) {
        newCard = parseInt(pickCard());
        players[i].push(newCard);
        console.log('Player ' + i + " received a " + newCard);
    }




    console.log("New 'sett-e-mizz' game started.");
    
}
init();