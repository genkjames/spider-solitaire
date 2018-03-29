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
      let card = $(`<div class="card cover ${deck[i].suit}" value=${deck[i].value}></div`);
      let p = $(`<p></p>`).text(`${deck[i].rank}`);
      card.append(p);
      card.append(p.clone());
      card.contents().css('visibility', 'hidden');
      $('.deck .slot').append(card);
    }
  }

  let selected = [];

  function showClicks() {
    $('.show').on('click', function(e) {
      if(selected.length < 2) {
        selected.push($(e.target));
        $(e.target).addClass('selected');
        console.log(2);
      }
      else {
        console.log(selected.indexOf($(e.target)));
      }
    });
  }

  function distributeInitialCards() {
    const cards = $('.deck .slot .card');
    const playingFields = $('.playing-field .slot');
    const numOfCards = cards.length - (playingFields.length * 5);
    distribute(numOfCards);
  }

  let p = 0;

  function distribute(numOfCards) {
    const cards = $('.deck .slot .card');
    const playingFields = $('.playing-field .slot');
    let field = 0;
    let show = numOfCards - playingFields.length + 1;
    let n = 1;

    const addCards = setInterval(function() {
      if(n < numOfCards+1) {
        if(show === n) {
          let frontCard = cards.eq(cards.length-n);
        frontCard.addClass('show');
        frontCard.removeClass('cover');
        frontCard.contents().css('visibility', 'visible');
        show++;
        }

        playingFields[field].append(cards[cards.length-n]);
        field++;

        if(field === playingFields.length) {
          field = 0;
          p++;
        }

        n++;
      }
      else {
        clearInterval(addCards);
        showClicks();
      }
    }, 60);
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

  $('.deck').on('click', function() {
    if($('.deck .slot .card').length > 0) {
      distribute($('.playing-field .slot').length);
    }
  });
});
