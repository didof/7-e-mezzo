// DISPLAYER
const DisplayControll = (function() {

    return {
        test: function() {
            console.log('displayControll status: OK');
        },
        updateBody: function(turn, value, suit, total) {
            let playerTurn = "player-" + turn;
            let totalTurn = "total-" + turn;
            let text = String(value + suit) + "\n";

            document.getElementById(playerTurn).insertAdjacentHTML('beforeend', text);
            document.getElementById(totalTurn).textContent = total;
        }
    }
})();

// MATH
const MathControll = (function() {
    const buildDeck = function() {
        let deck, allSuit, suit;
        deck = [[], [], [], []];
        allSuit = ['H', 'D', 'C', 'S'];

        for (let i = 0; i < 4; i++) {
            for (let y = 0; y < 10; y++) {
                deck[i][y] = y + allSuit[i];
            }
        }
        return deck;
    }
    deck = buildDeck();

    let data = {
        players: [[], []],
        totals: [0, 0],
        turn: 0
    }

    // let players = [[],[]];
    // let totals = [0, 0]
    // let turn = 0;

    

    return {
        test: function() {
            console.log('mathControll status: OK');
        },
        deck: function() {
            return {
                mathData: {
                    deck: deck,
                    players: data.players,
                    turn: data.turn,
                    totals: data.totals
                }
            }
        },
        check: function(counter) {
            if (counter > 7.5) {
                console.log('A\' sballet!');
                return inGame = false;
            } else if (counter == 7.5) {
                console.log('sett-e-mizz!');
                return inGame = true;
            } else {
                return inGame = true;
            }
        },
        updateCounter: function(turn, value) {
            totals[turn] += parseInt(value);
            console.log('Player ' + turn + ' counter: ' + totals[turn]);
            return totals[turn];
        }
    }
})();

// CONTROLLER
const Controller = (function(Render, Logic) {
    // get deck
    const logicDeck = Logic.deck();
    let deck = logicDeck.data.deck;
    let players = logicDeck.data.players;
    let turn = logicDeck.data.turn;
    let totals = logicDeck.data.totals;

    const pickCard = function() {
        let suit = Math.floor(Math.random() * (deck.length - 1) + 1);
        let card = Math.floor(Math.random() * (deck[suit].length - 1) + 1);
        return String(deck[suit].splice(card, 1));
    }

    const actionCard = function() {
        let card = pickCard();
        console.log(card);
    }

    const setupEventListener = function() {
        document.getElementById('betHandler').addEventListener('click', betClick);
        document.getElementById('holdHandler').addEventListener('click', holdClick);
    }

    const matchStarer = function() {
        console.log('New Match started.');
        
        // reset all (deck, hands, counters, turn)
        deck = deck;
        players = players;
        turn = turn;
        totals = totals;

        suit = "";
        value = 0;
        
        // distribute the cards
        for (var i = 0; i < players.length; i++) {
        newCard = pickCard();
        value = newCard.split('')[0];
        suit = newCard.split('')[1];
        players[i].push(newCard);
        console.log('Player ' + i + " received a " + newCard);

        // update the counter
        totals[turn] = Logic.updateCounter(i, value);

        // update the body
        Render.updateBody(i, value, suit, totals);
        }
    } // close matchStarter

    const betClick = function() {
        let hand, num, suit, counter;
        counter = 0;

        // 1. Pick a newCard from deck and add into hand of player in turn
        newCard = pickCard();
        players[turn].push(newCard);
        console.log('Player ' + turn + " picked " + newCard);

        // 2. Calculate if over 7.5 (or exactly 7.5)
            // Slice the cards labels and use only the numeric half
            // Add and check if > 7.5 or == 7.5
        hand = players[turn];
        for (let i = 0; i < hand.length; i++) {
            num = hand[i].split('');
            num[0] = parseInt(num[0]);
            suit = num[1];

            switch(num[0]) {
                case 8: case 9: case 10:
                num[0] = 0.5;
                break;
            }
        }
            totals[turn] = Logic.updateCounter(0, num[0]);
            Logic.check(totals);


        // 3. Render
        Render.updateBody(turn, num[0], suit, totals);
    }

    const holdClick = function() {
        console.log('holdClick');
        // turn of PC
        // valuta il suo punteggio

    }






    return {
        test: function() {
            console.log('Controller check all:');
            render.test();
            logic.test();
        },
        showDeck: function() {
            console.log('Turn of Player ' + turn)
            console.table(deck);
            console.table(players);
            console.log(totals);
        },
        init: function() {
            matchStarer();
            setupEventListener();
        }
    }
})(DisplayControll, MathControll);

// execution
Controller.init();