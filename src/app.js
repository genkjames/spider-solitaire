$(document).ready(function() {
  let upDeck = 0;

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
      let card = $(`<div class="card cover ${deck[i].suit}" data-value=${deck[i].value}></div`);
      let p = $(`<p></p>`).text(`${deck[i].rank}`);
      card.append(p);
      // card.append(p.clone());
      card.contents().css('visibility', 'hidden');
      $('.deck .slot').append(card);
    }
  }

  let selected = [];

  function showClicks() {
    $('.playing-field').on('click', function(e) {
      if($(e.target).hasClass('selected')) {
        $(e.target).removeClass('selected');
        selected.pop();
      }
      else if($(e.target).hasClass('show')) {
        if(selected.length < 2 && !$(e.target).hasClass('selected')) {
          selected.push($(e.target));
          $(e.target).addClass('selected');
          compareCards();
        }
      }
      else if($(e.target).hasClass('slot')) {
        selected.push($(e.target));
        fillEmptySlot();
      }
    });
  }

  function compareCards() {
    if(selected.length === 2) {
      const lastCard = getLastCard();
      const remainder = lastCard.data("value") - selected[0].data("value");
      if(remainder === 1) {
        let previousParent = selected[0].parent();
        let parent = selected[1].parent();
        const ppArray = getAllCards(previousParent);

        addAllCards(ppArray, parent);
        showLastCard(previousParent);
      }
      emptySelectedArray();
      checkForFullSequence();
    }
  }

  function getLastCard() {
    return selected[1].parent().children().last();
  }

  function getAllCards(start) {
    let indexOfCardChosen = 0;
    for(let i = 0; i < start.children().length; i++) {
      if(start.children().eq(i).hasClass('selected')) {
        indexOfCardChosen = i;
        break;
      }
    }

    let array = [start.children().eq(indexOfCardChosen)];
    for(let j = indexOfCardChosen+1; j < start.children().length; j++) {
      const val1 = start.children().eq(j).data('value');
      const val2 = start.children().eq(j-1).data('value');

      if (val2 - val1 === 1) {
        array.push(start.children().eq(j));
      }
      else {
        array = [];
        break;
      }
    }

    return array;
  }

  function addAllCards(ppArray, parent) {
    if (ppArray.length === 1) {
      parent.append(selected[0]);
    }
    else {
      for(let i = 0; i < ppArray.length; i++) {
        parent.append(ppArray[i]);
      }
    }
  }

  function fillEmptySlot() {
    if(selected.length == 2) {
      if(selected[1].hasClass('slot')) {
        let previousParent = selected[0].parent();
        let pArray = getAllCards(previousParent);

        addAllCards(pArray, selected[1]);

        // previousParent.children().last().removeClass('cover').addClass('show').contents().css('visibility', 'visible');

        showLastCard(previousParent);
      }
      emptySelectedArray();
    }
  }

  function emptySelectedArray() {
    for(let i = 0; i < selected.length; i++) {
      selected[i].removeClass('selected');
    }
    selected = [];
  }

  function showLastCard(container) {
    container.children().last().removeClass('cover').addClass('show').contents().css('visibility', 'visible');
  }

  function checkForFullSequence() {
    const kings = $('.show[data-value="13"]');
    let kingIndex = 0;
    if (kings.length > 0) {
      for (let i = 0; i < kings.length; i++) {
        const parent = kings.eq(i).parent();
        const elements = parent.children('.show');
        for (let j = elements.length-1; j >= 0; j--) {
          if ($(elements[j]).data('value')===13) {
            const status = isFullSequence(elements, j);

            if (status != false) {
              console.log(status.length);
              if(status.length === 13) {
                upDeck++;
                const previousParent = $(status[0]).parent();
                const winnerSlots = $('.finished-deck-slots .slot');

                for(let k = 0; k < winnerSlots.length; k++) {
                  if (winnerSlots.eq(k).children().length === 0) {
                    for(let l = status.length-1; l >= 0; l--) {
                      winnerSlots.eq(k).append(status[l]);
                    }
                    showLastCard(previousParent);
                    break;
                  }
                }
                if(upDeck === 5) {
                  isWinner();
                }
              }
            }
          }
        }
      }
    }
  }

  function isFullSequence(arr, startIndex) {
    if (arr.length - startIndex > 1) {
      let arr2 = [arr[startIndex]];

      for (let i = startIndex+1; i < arr.length; i++) {
        const remainder = $(arr[i-1]).data('value') - $(arr[i]).data('value');
        console.log(remainder);

        if(remainder === 1) {
          arr2.push(arr[i]);
        }
        else {
          arr2 = [];
          return false;
        }
      }
      return arr2;
    }
    return false;
  }

  function isWinner() {
    alert("you win");
  }

  function distributeInitialCards() {
    const cards = $('.deck .slot .card');
    const playingFields = $('.playing-field .slot');
    const numOfCards = cards.length - (playingFields.length * 5);
    distribute(numOfCards);
    showClicks();
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
      }
    }, 60);
  }

  $("#submit").on("click", function(e){
    e.preventDefault();
    $("#landing").css("animation", "slide 1s ease-out 0s 1 forwards");

    const name = $("[name='name']").val();
    const suit = $("[name='suit']").val();

    $('#player-name').text(name);
    const finalDeck = shuffle(makeDeck(suit, 5));
    viewDeck(finalDeck);
    distributeInitialCards();
  });

  $('.deck').on('click', function() {
    if($('.deck .slot .card').length > 0) {
      distribute($('.playing-field .slot').length);
    }
  });
});
