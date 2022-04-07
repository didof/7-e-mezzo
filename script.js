const Display = (function() {
    let id = 0;
    
    console.log()

    return {
        test: function() {
            console.log('Display module status: OK');
        },
        updateTotal: function(turn, totals) {
            for (var turn; turn < totals.length; turn++) {
                document.getElementById('total-' + turn).textContent = totals[turn];
            }
        },
        addCard: function(turn, card, firstCicle) {
            let cardPath;
            cardPath = '<img src="cards/retro.jpg" id="img-%id%" class="card">';
            cardPath = cardPath.replace('%id%', id);
            id++;

            if (firstCicle === false) {
                cardPath = cardPath.replace('retro', card);
            }
            
            document.getElementById('cards-' + turn).insertAdjacentHTML('beforeend', cardPath);
        },
        showOwnCard: function(card, hide) {
            if(hide === false) {
               document.getElementById('img-0').src = "cards/retro.jpg";
            } else {
                document.getElementById('img-0').src = "cards/" + card + ".jpg";
            }
        },
        showAll: function(card0, card1) {
            document.getElementById('img-0').src = "cards/" + card0 + ".jpg";
            document.getElementById('img-1').src = "cards/" + card1 + ".jpg";
        },
        restartDisplay: function() {
        
        }
    }
})();

const Logic = (function() {
    const buildDeck = function() {
        let deck, allSuit, suit;
        deck = [[], [], [], []];
        allSuit = ['D', 'B', 'C', 'S'];

        for (let i = 0; i < 4; i++) {
            for (let y = 1; y <= 10; y++) {
                deck[i][y] = y + "-" + allSuit[i];
            }
        }
        return deck;
    }

    let data = {
        deck: buildDeck(),
        players: [[], []],
        totals: [0, 0],
        turn: 0
    }

    const splitCard = function(card) {
        let splittedCard = card.split('-');
        return {
            numHalf: splittedCard[0],
            letHalf: splittedCard[1]
        }
    }

    const updateTotals = function(turn, card) {
        let evaluatedCard;
        evaluatedCard = specialCard(card);
        data.totals[turn] += parseFloat(evaluatedCard);

        return data.totals;
    }

    const specialCard = function(value) {
        if (value == 8 || value == 9 || value == 10) {
            return value = 0.5;
        }
        return value;
    }

    const thereIsLoser = function() {
        for(var i = 0; i < data.totals.length; i++) {
            if(data.totals[i] > 7.5) {
                return i;
            }
        }
    }

    return {
        test: function() {
            console.log('Logic module status: OK');
        },
        restartData: function() {
            return {
                deck: buildDeck(),
                players: data.players,
                totals: [0, 0],
                turn: 0
            }
        },
        getData: function() {
            return {
                mathData: {
                    deck: data.deck,
                    players: data.players,
                    turn: data.turn,
                    totals: data.totals
                }
            }
        },
        showDeckHands: function() {
            console.log('It\'s turn of Player ' + data.turn)
            console.table(data.deck);
            console.log(data.players);
            console.log('Player 0 total: ' + data.totals[0] + '\nPlayer 1 total: ' + data.totals[1]);
        },
        addCardToHand: function(turn, card) {

            // aggiungere la carta alla mano del giocatore
            data.players[turn].push(card);          // 3-B

            // aggioranre i totals
            let splittedCard = splitCard(card);     // 3
            let updatedTotals = updateTotals(turn, splittedCard.numHalf);  // [3, 0]

            // check for loser
            return updatedTotals;

        },
        whoWin: function() {
            console.table(data.totals);
            if (data.totals[1] >= data.totals[0] && data.totals[1] <= 7.5) {
                console.log('Player 1 win!');
            } else {
                console.log('Player 0 win!');
            }
        },
        utilsFunctions: function() {
            return {
                splitCard: splitCard,
                specialCard: specialCard,
                thereIsLoser: thereIsLoser
            }
        }
    }
})();

const Controller = (function(display, logic) {
    // global points
    let points = [10, 10];

    // get data from math module
    let data, deck, players, turn, totals;
    data = logic.restartData();
        deck = data.deck;
        players = data.players;
        turn = data.turn;
        totals = data.totals;

    // get utils functions from math module
    let functions = logic.utilsFunctions();

    const setupEventListener = function() {
        document.getElementById('betHandler').addEventListener('click', betClick);
        document.getElementById('holdHandler').addEventListener('click', holdClick);
    }

    const pickCardFromDeck = function() {
        let suit, card;
        suit = Math.floor(Math.random() * (data.deck.length - 1) + 1);
        card = Math.floor(Math.random() * (data.deck[suit].length - 1) + 1);
        console.log(suit, card);
        return String(data.deck[suit].splice(card, 1));
    }

    const pickAndAddCard = function(turn, firstCicle) {
        let pickedCard, loser;

        // math
        pickedCard = pickCardFromDeck();
        totals = logic.addCardToHand(turn, pickedCard);

        // display
        display.updateTotal(turn, totals);

        display.addCard(turn, pickedCard, firstCicle);

        // check for loser
        if(functions.thereIsLoser() === turn) {
            console.log('player ' + turn + ' has lost');
            points[turn]--;
            console.log(points);
            resetAll();
        }
    }

    const resetAll = function() {
        console.log('Reset All.')
        
        data = logic.restartData();
    
        suit = "";
        value = 0;

        display.restartDisplay();
    }

    const matchStarter = function() {
        console.log('New Match started.');
        
        // reset all (deck, hands, counters, turn)
        resetAll();
        
        // distribute the cards, update deck, hands, totals, check for loser
        for (var i = 0; i < data.players.length; i++) {
            pickAndAddCard(i, true);
        }

        document.getElementById('img-0').addEventListener('click', function() {
            display.showOwnCard(data.players[0][0], true);
        });
        document.getElementById('img-0').addEventListener('mouseout', function() {
            display.showOwnCard(data.players[0][0], false);
        });
    } // close matchStarter

    const betClick = function() {
        pickAndAddCard(turn, false);
    }

    const holdClick = function() {
        setTimeout(function(){ 
            turn = 1;

            if(calcProb(turn) === true) {
                pickAndAddCard(turn, false);

                // check for loser
                if(functions.thereIsLoser() === turn) {
                console.log('player ' + turn + ' has lost');
                points[turn]--;
                console.log(points);
                logic.whoWin();
                display.showAll(data.players[0][0], data.players[1][0]);
                resetAll();
                } else {
                    holdClick();
                }        

            } else if(calcProb(turn) === false) {
                console.log('Player ' + turn + ' says: I\'m fine.');

                logic.whoWin();
                display.showAll(data.players[0][0], data.players[1][0]);
            }
        }, 1000);
    }

    const calcProb = function(turn) {

        let gap, fav, visibles, temporary;

        gap = 7.5 - totals[turn];
        fav = [];
        visibles = 0;

        deck.flat().forEach(card => {
            value = functions.splitCard(card).numHalf;
            value = functions.specialCard(value);
            if(value <= gap) {
                fav.push(value);
            }
        });

        for(var i = 1; i < players[0].length; i++) {
            console.log(players[0][i]);
            temporary = functions.splitCard(players[0][i]).numHalf;
            temporary = functions.specialCard(temporary);
            visibles += parseFloat(temporary);
        }

        if((fav.length / deck.flat().length) >= 0.5) {
            // computer si tira la carta
            return true;
        } else {
            if(totals[turn] <= visibles) {
                return true;
            }
            // computer sta bene
            return false;
        } 
    }

    return {
        test: function() {
            console.log('Controller check all:');
            display.test();
            logic.test();
        },
        init: function(inGame) {
            if(inGame === true) {
                matchStarter();
                setupEventListener();
            } else {
                console.log('stop game');
            }
            
        }
    }


})(Display, Logic);

Controller.init(true);
