$(document).ready(function() {
  function makeDeck(suitName, numOfSets) {
    const ranks = ["K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"];
    const deck = [];
    let val = ranks.length;

    for (let i = 0; i < ranks.length; i++) {
      for(let j = 0; j < numOfSets; j++) {
        deck.push({suit: suitName, rank: ranks[i], value: val});
      }
      val--;
    }
    return deck;
  }

  function shuffle(deck) {
    const shuffledDeck = [];

    while(deck.length > 0) {
      let cardNum = Math.round(Math.random()*(deck.length-1));
      shuffledDeck.push(deck[cardNum]);
      deck.splice(cardNum, 1);
    }

    return shuffledDeck;
  }

  function viewDeck(deck) {
    for(let i = 0; i < deck.length; i++) {
      let card = $(`<div class="card" value=${deck[i].value}></div`);
      let p = $(`<p></p>`).text(`${deck[i].rank}`);
      card.append(p);
      card.append(p.clone());
      let cover = $('<div class="cover"></div>');
      card.append(cover);
      $('.deck .slot').append(card);
    }
  }

  function distributeInitialCards() {
    const cards = $('.deck .slot .card');
    const playingFields = $('.playing-field .slot');
    const numOfCards = cards.length - (playingFields.length * 5);
    distribute(numOfCards);
  }

  function distribute(numOfCards) {
    const cards = $('.deck .slot .card');
    const playingFields = $('.playing-field .slot');
    let field = 0;
    let n = 1;
    let p = 0;

    const addCards = setInterval(function() {
      if(n < numOfCards+1) {
        playingFields[field].append(cards[cards.length-n]);
        cards.eq(cards.length-n).css('top', p*15+"px");
        cards.eq(cards.length-n).css('left', "0px");
        field++;

        if(field === playingFields.length) {
          field = 0;
          p++;
        }

        n++;
      }
      else {
        clearInterval(addCards);
      }
    }, 80);
  }

  $("#submit").on("click", function(e){
    e.preventDefault();
    $("#landing").css("animation", "slide 1s ease-out 0s 1 forwards");

    const name = $("[name='name']").val();
    const suit = $("[name='suit']").val();

    $('#player-name').text(name);
    viewDeck(shuffle(makeDeck(suit, 5)));
    distributeInitialCards();
  });
});
