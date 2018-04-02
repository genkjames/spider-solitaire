$(document).ready(function() {
  let upDeck = 0;
  let moveHistory = [];
  const ranks = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];

  class Moves {
    constructor(element, lastPlace, hideLC, hide) {
      this.element = element;
      this.lastPlace = lastPlace;
      this.hideLastCard = hideLC;
      this.hide = hide;
    }
    addToArray(newClass) {
      // moveHistory.push(this);
      moveHistory.push(newClass);
    }
  }

  function randomLetter() {
    return ranks[Math.round(Math.random() * (ranks.length - 1))];
  }

  function randomSymbol() {
    const symbols = ['diamond', 'heart', 'spade', 'clover'];
    return symbols[Math.round(Math.random() * (symbols.length - 1))];
  }

  function generateTitleCards() {
    const titleCards = $('#title-cards');
    const tops = [40, 200, 120, 190, 310, 342, 446, 696, 624, 141, 332, 497, 181, 385, 497, 374, 432, 268, 624, 490, 629, 24, 45, 615, 600, 19, 51, 266];
    const lefts = [80, 54, 190, 350, 165, 675, 174, 397, 574, 630, 352, 331, 827, 865, 569, 476, 44, 528, 743, 774, 197, 356, 522, 23, 935, 741, 931, 930];
    const degrees = [40, 60, 20, 80, 330, 80, 50, 80, 300, 150, 20, 10, 40, 280, 320, 350, 320, 40, 80, 133, 120, -50, 40, 40, 50, 109, 146, 97];
    for (let i = 0; i < tops.length; i += 1) {
      const titleCard = $(`<div class='card'></div>`);
      const rank = $(`<p class="${randomSymbol()}">${randomLetter()}</p>`);
      titleCard.append(rank);
      titleCard.append(rank.clone());
      titleCard.css('top', tops[i]);
      titleCard.css('left', lefts[i]);
      titleCard.css('transform', `rotate(${degrees[i]}deg)`);
      titleCards.append(titleCard);
    }
  }

  generateTitleCards();

  function makeDeck(suitName, numOfSets) {
    const deck = [];
    let val = ranks.length;
    for (let i = 0; i < ranks.length; i += 1) {
      for (let j = 0; j < numOfSets; j += 1) {
        deck.push({ suit: suitName, rank: ranks[i], value: val });
      }
      val -= 1;
    }
    return deck;
  }

  function shuffle(deck) {
    const shuffledDeck = [];
    while (deck.length > 0) {
      const cardNum = Math.round(Math.random() * (deck.length - 1));
      shuffledDeck.push(deck[cardNum]);
      deck.splice(cardNum, 1);
    }
    return shuffledDeck;
  }

  function viewDeck(deck) {
    for (let i = 0; i < deck.length; i += 1) {
      const $card = $(`<div class="card cover" data-value=${deck[i].value}></div`);
      const $p = $(`<p class="${deck[i].suit}"></p>`).text(`${deck[i].rank}`);
      $card.append($p);
      $card.append($p.clone());
      $card.contents().css('visibility', 'hidden');
      $('.deck .slot').append($card);
    }
  }

  let selected = [];

  function showClicks() {
    $('.playing-field').on('click', function(e) {
      if ($(e.target).hasClass('selected')) {
        $(e.target).removeClass('selected');
        selected.pop();
      } else if ($(e.target).hasClass('show')) {
        if (selected.length < 2 && !$(e.target).hasClass('selected')) {
          selected.push($(e.target));
          $(e.target).addClass('selected');
          compareCards();
        }
      } else if ($(e.target).hasClass('slot')) {
        selected.push($(e.target));
        fillEmptySlot();
      }
    });
  }

  function removeClicks() {
    $('.playing-field').off('click');
    $('.deck .slot').off('click');
  }

  function addToMoveArray(arr1, arr2, hlc, hde) {
    const moves = new Moves(arr1, arr2, hlc, hde);
    moves.addToArray();
    console.log(moves);
  }

  function compareCards() {
    if (selected.length === 2) {
      const lastCard = getLastCard();
      const remainder = lastCard.data('value') - selected[0].data('value');
      if (remainder === 1) {
        const previousParent = selected[0].parent();
        const parent = selected[1].parent();
        const ppArray = getAllCards(previousParent);
        let hideLastCard = true;

        if (selected[0].prev().hasClass('show')) {
          hideLastCard = false;
        }
        addToMoveArray([ppArray], [previousParent], hideLastCard, false);
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
    for (let i = 0; i < start.children().length; i += 1) {
      if (start.children().eq(i).hasClass('selected')) {
        indexOfCardChosen = i;
        break;
      }
    }

    let array = [start.children().eq(indexOfCardChosen)];
    for (let j = indexOfCardChosen+1; j < start.children().length; j += 1) {
      const val1 = start.children().eq(j).data('value');
      const val2 = start.children().eq(j - 1).data('value');

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
      for (let i = 0; i < ppArray.length; i += 1) {
        parent.append(ppArray[i]);
      }
    }
  }

  function fillEmptySlot() {
    if (selected.length == 2) {
      if (selected[1].hasClass('slot')) {
        const previousParent = selected[0].parent();
        const pArray = getAllCards(previousParent);

        let hideLastCard = true;

        if (selected[0].prev().hasClass('show')) {
          hideLastCard = false;
        }
        addToMoveArray([pArray], [previousParent], hideLastCard, false);
        addAllCards(pArray, selected[1]);
        showLastCard(previousParent);
      }
      emptySelectedArray();
    }
  }

  function emptySelectedArray() {
    for (let i = 0; i < selected.length; i += 1) {
      selected[i].removeClass('selected');
    }
    selected = [];
  }

  function showLastCard(container) {
    container.children().last().removeClass('cover').addClass('show')
      .contents()
      .css('visibility', 'visible');
  }

  function checkForFullSequence() {
    console.log('check for full sequence');
    const $kings = $('.playing-field .show[data-value="13"]');
    let kingIndex = 0;
    if ($kings.length > 0) {
      for (let i = 0; i < $kings.length; i++) {
        const parent = $kings.eq(i).parent();
        const elements = parent.children('.show');
        for (let j = elements.length-1; j >= 0; j--) {
          if ($(elements[j]).data('value')===13) {
            const status = isFullSequence(elements, j);
            if (status != false) {
              if(status.length === 13) {
                upDeck++;
                const previousParent = $(status[0]).parent();

                addDeckSequenceToMV(status, previousParent);
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

  function addDeckSequenceToMV(st, prev) {
    let prevArray = [];
    for(let pp = 0; pp < st.length; pp += 1) {
      prevArray.push(prev);
    }
    let lastCd = prev.children().length - 14;
    let hideLastCard = false;
    if(prev.children().eq(lastCd).hasClass('cover')) {
      hideLastCard = true;
    }
    addToMoveArray(st, prevArray, hideLastCard, false);
  }

  function isFullSequence(arr, startIndex) {
    if (arr.length - startIndex > 1) {
      let arr2 = [arr[startIndex]];
      for (let i = startIndex+1; i < arr.length; i++) {
        const remainder = $(arr[i-1]).data('value') - $(arr[i]).data('value');
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

  function distributeInitialCards() {
    const $cards = $('.deck .slot .card');
    const $playingFields = $('.playing-field .slot');
    const numOfCards = $cards.length - ($playingFields.length * 5);
    distribute(numOfCards);
    removeClicks();
    showClicks();
  }

  let p = 0;

  function distribute(numOfCards) {
    const cards = $('.deck .slot .card');
    const playingFields = $('.playing-field .slot');
    let field = 0;
    let show = numOfCards - playingFields.length + 1;
    let n = 1;
    const cardArray = [];
    const placeArray = [];
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
        cardArray.push(cards[cards.length-n]);
        placeArray.push($('.deck .slot'));
        field++;
        if(field === playingFields.length) {
          field = 0;
          p++;
        }
        n++;
      }
      else {
        clearInterval(addCards);
        if(cardArray.length === 7) {
          addToMoveArray(cardArray, placeArray, false, true);
        }
        checkForFullSequence();
      }
    }, 60);
  }

  function hideLastCard(slot) {
    if(slot.children()) {
      slot.children().last().addClass('cover').removeClass('show').contents().css('visibility', 'hidden');
    }
  }

  function coverCard(el) {
    el.addClass('cover').removeClass('show').contents().css('visibility', 'hidden');
  }

  function gameScore() {
    const m = parseInt($('#minuteValue').text());
    const s = parseInt($('#secondValue').text());
    const score = (((m * 60) + s) * 30) - 30;
    $('#score').text(score);
    return score;
  }

  function calculateScore(score) {
    const svg = $('svg');
    svg.css('fill', '#ffffff');
    sc = 0;
    if (score < 1600) {
      sc = 1;
    } else if (score < 4000) {
      sc = 2;
    } else {
      sc = 3;
    }
    for (let i = 0; i < sc; i += 1) {
      svg.eq(i).css('fill', '#fdff00');
    }
  }

  let name = "";

  function isWinner() {
    clearInterval(startTimer);
    $('#pause').off('click');
    const score = gameScore();
    calculateScore(score);
    $('#game-status-container').css('display', 'block');
    $('#status').text(`Congratulations${name}! You got a score of ${score}.`);
  }

  function loss() {
    const score = gameScore();
    $('#pause').off('click');
    $('svg').css('fill', '#ffffff');
    $('#game-status-container').css('display', 'block');
    $('#status').text(`You got a score of ${score}. Better luck next time${name}!`);
  }

  function timer() {
      let $m = parseInt($('#minuteValue').text());
      let $s = parseInt($('#secondValue').text());
      if ($s === 0 && $m >= 0) {
        $m -= 1;
        $s = 60;
      }
      $s -= 1;
      if ($m === 0 && $s === 0) {
        gameScore();
        clearInterval(startTimer);
        loss();
        removeClicks();
        moveHistory = [];
      }
      if($s % 10 === 0) {
        gameScore();
      }
      if ($s.toString().length === 1) {
        $s = '0' + $s;
      }
      $('#minuteValue').text($m);
      $('#secondValue').text($s);
  }

  let startTimer;

  function restartTimer() {
    clearInterval(startTimer);
    $('#minuteValue').text('8');
    $('#secondValue').text('00');
  }

  function play() {
    let suit = $("[name = 'suit']:checked").val();
    if (suit === undefined) {
      suit = 'diamond';
    }
    $('#player-name').text(name);
    const finalDeck = shuffle(makeDeck(suit, 5));
    viewDeck(finalDeck);
    distributeInitialCards();
    clickDeck();
    gameScore();
    pauseGame();
    setTimeout(function() {
      startTimer = setInterval(timer, 1000);
    }, 1400);
  }

  function clickDeck() {
    $('.deck .slot').on('click', function() {
      if($('.deck .slot .card').length > 0) {
        distribute($('.playing-field .slot').length);
      }
    });
  }

  $("#submit").on("click", function(e){
    e.preventDefault();
    if($('[name="name"]').val() !== "") {
      name = " "+$("[name='name']").val();
    }
    $('#landing').css('animation', 'fade 2s ease-out 0s 1 forwards');
    $('.body-cover').css('animation', 'fade 2s ease-out 0s 1 forwards');
    $('.side-body-cover').css('animation', 'fade 2s ease-out 0s 1 forwards');
    setTimeout(function() {
      $('#landing').css('display', 'none');
    $('.body-cover').css('display', 'none');
    }, 2000);
    setTimeout(play, 1500);
  });

  $('#undo').on('click', function() {
    if(moveHistory.length > 0) {
      let mv = moveHistory[moveHistory.length-1].element.length;
      if(mv === 13) {
        undoDeckSequence(moveHistory[moveHistory.length-1].element);
      } else {
        for(let i = mv-1; i >= 0; i--) {
          const element = moveHistory[moveHistory.length-1].element[i];
          const slot = moveHistory[moveHistory.length-1].lastPlace[i];
          if (moveHistory[moveHistory.length-1].hideLastCard === true) {
            hideLastCard(slot);
          }
          if (moveHistory[moveHistory.length - 1].hide === true) {
            coverCard($(element));
          }
          slot.append(element);
        }
        moveHistory.pop();
      }
    }
  });

  function undoDeckSequence(mvel) {
    const mvLength = mvel.length;
    for(let i = 0; i < mvLength; i++) {
      const element = moveHistory[moveHistory.length-1].element[i];
      const slot = moveHistory[moveHistory.length-1].lastPlace[i];
      if (moveHistory[moveHistory.length-1].hideLastCard === true) {
        if(i === 0) {
          hideLastCard(slot);
        }
      }
      if (moveHistory[moveHistory.length - 1].hide === true) {
        coverCard($(element));
      }
      slot.append(element);
    }
    moveHistory.pop();
    upDeck--;
  }

  $('#reset').on('click', function() {
    $('.card').remove();
    moveHistory = [];
    upDeck = 0;
    $('#pause').off('click');
    restartTimer();
    play();
  });

  let pause = true;
  function pauseGame() {
    $('#pause').on('click', function() {
      if(pause) {
        $(this).text("Play");
        clearInterval(startTimer);
        removeClicks();
      }
      else {
        $(this).text("Pause");
        startTimer = setInterval(timer, 1000);
        clickDeck();
        showClicks();
      }
      pause = !pause;
    });
  }

  $('#close').on('click', function() {
    $('#game-status-container').css('display', 'none');
  });

  $(window).on('resize', function() {
    if($(this).width() > 1244) {
      $('.options').css('display', 'block');
    }
    else {
      $('.options').css('display', 'none');
    }
  });

  $('.side-bar-button').on('click', function() {
    $('.options').css('display', 'block');
  });

  $('.back').on('click', function() {
    $('.options').css('display', 'none');
  });
});
