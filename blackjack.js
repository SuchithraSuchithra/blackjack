/*
--------------------------------------------------------------------------------
GLOBAL VARIABLES and CONSTANTS
--------------------------------------------------------------------------------
*/
const RANKS = [
  'A',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  'J',
  'Q',
  'K',
]
// spades (♠), clubs (♣), diamonds (♦), hearts (♥)
const SUITS = ['s', 'c', 'd', 'h']
const SOUNDS = {
  cardsDrop: './sounds/carddrop.mp3',
  hit: './sounds/pounding-cards-on-table.mp3',
  failure: './sounds/failure.mp3',
  success: './sounds/success.mp3',
  gameMusic: './sounds/gamemusic.mp3',
}

const BLACKJACK_VALUE = 21
const DEALERS_MAX_VALUE = 17
const ACES_VALUE = 11
const CARDS_WITH_FACE_VALUE_10_ARRAY = ['J', 'Q', 'K']
const SUCCESS_MSG = 'Congratulations, You Won!!!'
const FAILURE_MSG = 'Hard Luck, You Lost!!!'
const DRAW_MSG = 'Its a Draw!!!'
const DECK_OF_CARDS_ARRAY = buildOriginalDeck()

let currentCardsArray = []
let dealersFirstHiddenCardValue = ''
let dealersHandArray = []
let playersHandArray = []

/*
--------------------------------------------------------------------------------
 DOMS
--------------------------------------------------------------------------------
*/

const HIT_BUTTON_ELEMENT = document.getElementById('hit-button')
const STAY_BUTTON_ELEMENT = document.getElementById('stay-button')
const DEALERS_HAND = document.querySelector('.dealers-hand')
const PLAYERS_HAND = document.querySelector('.players-hand')
const SUCCESS_MSG_DISPLAY_SECTION_ELEMENT = document.querySelector(
  '.success-msg-display'
)
const PLAY_AGAIN_BUTTON_ELEMENT = document.getElementById('play-again-button')
const PLAY_EXIT_SECTION_ELEMENT = document.querySelector('.play-exit')
const PLAYER = new Audio()

/*
--------------------------------------------------------------------------------
 EVENT LISTENERS
--------------------------------------------------------------------------------
*/

HIT_BUTTON_ELEMENT.addEventListener('click', handleHitAction)
STAY_BUTTON_ELEMENT.addEventListener('click', () => {
  handleStayAction()
})
PLAY_AGAIN_BUTTON_ELEMENT.addEventListener('click', handlePlayAgainAction)

/*
--------------------------------------------------------------------------------
 HANDLERS
--------------------------------------------------------------------------------
*/

function handlePlayAgainAction() {
  // Hide play again
  hidePlayAgain()

  // Hide the success msg
  hideSuccessMsg()

  //   // Enable HIT and STAY button
  toggleActionButtons(false)

  // Restore states
  setInitialStates()
}

function playSound(soundSourceKey) {
  PLAYER.src = SOUNDS[soundSourceKey]
  PLAYER.play()
}

function handleHitAction() {
  if (!hasWinner()) {
    addCard('player')
  }
  hasWinner()
}

function handleStayAction() {
  toggleActionButtons(true)
  const playersScore = getCurrentScore('player')

  console.log('Player scored ', playersScore)

  if (playersScore === BLACKJACK_VALUE) {
    playSound('success')
    showSuccessMsg(SUCCESS_MSG)
  } else if (playersScore > BLACKJACK_VALUE) {
    playSound('failure')
    showSuccessMsg(FAILURE_MSG)
  } else {
    runAutomaticDealersHitActions()
  }
  displayPlayAgain()
}

/*
--------------------------------------------------------------------------------
 FUNCTIONS
--------------------------------------------------------------------------------
*/

window.onload = function () {
  playSound('gameMusic')
}

function displayPlayAgain() {
  PLAY_EXIT_SECTION_ELEMENT.classList.remove('hide')
}

function hidePlayAgain() {
  PLAY_EXIT_SECTION_ELEMENT.classList.add('hide')
}

function runAutomaticDealersHitActions() {
  while (getCurrentScore('dealer') < DEALERS_MAX_VALUE) {
    addCard('dealer')
  }

  checkWinner()
}

function checkWinner() {
  const dealersScore = getCurrentScore('dealer')
  const playersScore = getCurrentScore('player')
  console.log('Dealer scored ', dealersScore)

  if (playersScore === dealersScore) {
    playSound('success')
    showSuccessMsg(DRAW_MSG)
  } else if (dealersScore > BLACKJACK_VALUE || playersScore > dealersScore) {
    playSound('success')
    showSuccessMsg(SUCCESS_MSG)
  } else {
    playSound('failure')
    showSuccessMsg(FAILURE_MSG)
  }
}

function hasWinner() {
  const playersScore = getCurrentScore('player')
  if (playersScore >= BLACKJACK_VALUE) {
    handleStayAction()
    return true
  }

  return false
}

function checkBlackJackCondition() {
  const playersScore = getCurrentScore('player')
  const dealersScore = getCurrentScore('dealer')

  if (dealersScore === BLACKJACK_VALUE) {
    toggleActionButtons(true)
    playSound('failure')
    showSuccessMsg(FAILURE_MSG)
    displayPlayAgain()
  } else if (playersScore === BLACKJACK_VALUE) {
    toggleActionButtons(true)
    playSound('success')
    showSuccessMsg(SUCCESS_MSG)
    displayPlayAgain()
  }
}

function addCard(hand) {
  const randomCard = pickRandomCardFromDeck()
  if (hand === 'dealer') {
    dealersHandArray.push(randomCard)
    addCardToDOM('dealer', randomCard)
  } else if (hand === 'player') {
    playersHandArray.push(randomCard)
    addCardToDOM('player', randomCard)
  }
  return randomCard
}

function showSuccessMsg(msg) {
  unhideDealersFirstCard()
  const SUCCESS_MSG_ELEMENT = document.createElement('h1')
  SUCCESS_MSG_ELEMENT.setAttribute('id', 'msg-element')
  SUCCESS_MSG_ELEMENT.innerText = msg
  SUCCESS_MSG_ELEMENT.classList.add(
    'slit-in-vertical',
    'ribbon',
    'ribbon-content'
  )
  SUCCESS_MSG_DISPLAY_SECTION_ELEMENT.append(SUCCESS_MSG_ELEMENT)
}

function unhideDealersFirstCard() {
  const DEALERS_CARDS_ELEMENT = document.querySelectorAll('.dealers-hand .card')

  for (let dealersCard of DEALERS_CARDS_ELEMENT) {
    if (dealersCard.classList.contains('hide-card')) {
      dealersCard.classList.remove('hide-card')
      dealersCard.classList.add(dealersFirstHiddenCardValue)
      break
    }
  }
}

function hideSuccessMsg() {
  const SUCCESS_MSG_ELEMENT = document.getElementById('msg-element')
  SUCCESS_MSG_ELEMENT.remove()
}

function toggleActionButtons(stateValue) {
  HIT_BUTTON_ELEMENT.disabled = stateValue
  STAY_BUTTON_ELEMENT.disabled = stateValue
}

function getCurrentScore(hand) {
  const scoreArray = hand === 'player' ? playersHandArray : dealersHandArray
  let score = 0
  scoreArray.forEach((arrItem) => {
    score += arrItem.value
  })

  if (score > BLACKJACK_VALUE) {
    score = reduceAceValue(scoreArray, score)
    return score
  }
  // If dealer and if the current value is greater than or equal t0 DEALERS_MAX_VALUE
  // and player's value is greater than DEALERS_MAX_VALUE, reduce the Ace value
  if (hand === 'dealer') {
    const playersScore = getCurrentScore('player')
    if (score >= DEALERS_MAX_VALUE && playersScore > DEALERS_MAX_VALUE) {
      score = reduceAceValue(scoreArray, score)
    }
  }
  return score
}

function reduceAceValue(scoreArray, currentScore) {
  let score = currentScore
  for (let i = 0; i < scoreArray.length; ++i) {
    if (scoreArray[i].value == ACES_VALUE) {
      score -= ACES_VALUE - 1
      if (score < BLACKJACK_VALUE) {
        break
      }
    }
  }
  return score
}

function generateCardsArray() {
  const deckOfCards = []
  CARD_VALUES_ARRAY.forEach((cardValue) => {
    CARD_SUIT_TYPES_ARRAY.forEach((cardSuiteType) => {
      deckOfCards.push(cardValue + cardSuiteType)
    })
  })
  return deckOfCards
}

function pickRandomCardFromDeck() {
  const randomCardIndex = Math.floor(Math.random() * currentCardsArray.length)
  const randomCard = currentCardsArray[randomCardIndex]
  // remove the selected card from deck
  currentCardsArray.splice(randomCardIndex, 1)
  return randomCard
}

function generateDeckOfCards(count) {
  const deckOfCards = []

  for (let i = 0; i < count; i++) {
    deckOfCards.push(pickRandomCardFromDeck())
  }

  return deckOfCards
}

function addCardToDOM(hand, card) {
  const cardElement = document.createElement('div')
  cardElement.classList.add('card', 'slit-in-vertical')
  if (hand === 'dealer') {
    if (DEALERS_HAND.innerHTML == '') {
      cardElement.classList.add('hide-card')
      dealersFirstHiddenCardValue = card.face
      console.log(dealersFirstHiddenCardValue)
    } else {
      cardElement.classList.add(`${card.face}`)
    }
    DEALERS_HAND.append(cardElement)
    playSound('cardsDrop')
    return
  }
  if (hand === 'player') {
    cardElement.classList.add(`${card.face}`)
    PLAYERS_HAND.append(cardElement)
    playSound('cardsDrop')
    return
  }
}

function removeCardsFromDOM() {
  const CARDS_ELEMENTS = document.querySelectorAll('.card')

  CARDS_ELEMENTS.forEach((nodeElement) => {
    nodeElement.remove()
  })
}

function buildOriginalDeck() {
  const deck = []
  // Use nested forEach to generate card objects
  SUITS.forEach(function (suit) {
    RANKS.forEach(function (rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === 'A' ? ACES_VALUE : 10),
      })
    })
  })
  return deck
}

function setInitialStates() {
  currentCardsArray = DECK_OF_CARDS_ARRAY.slice(0, DECK_OF_CARDS_ARRAY.length)

  removeCardsFromDOM()

  // INITIAL STATES - Dealer and Player has 2 cards each
  dealersHandArray = generateDeckOfCards(2)
  // Add cards to DOM
  dealersHandArray.forEach((card) => {
    addCardToDOM('dealer', card)
  })

  playersHandArray = generateDeckOfCards(2)
  // Add cards to DOM
  playersHandArray.forEach((cardValue) => {
    addCardToDOM('player', cardValue)
  })

  checkBlackJackCondition()
}

/*
--------------------------------------------------------------------------------
 EXECUTION
--------------------------------------------------------------------------------
*/

setInitialStates()
