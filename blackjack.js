/*
--------------------------------------------------------------------------------
GLOBAL VARIABLES and CONSTANTS
--------------------------------------------------------------------------------
*/
const CARD_VALUES_ARRAY = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
]
// clubs (♣), diamonds (♦), hearts (♥) and spades (♠)
const CARD_SUIT_TYPES_ARRAY = ['♣', '♦', '♥', '♠']
const BLACKJACK_VALUE = 21
const CARDS_WITH_FACE_VALUE_10_ARRAY = ['J', 'Q', 'K']
// Create deck of cards
const DECK_OF_CARDS_ARRAY = generateCardsArray()
// console.log('CARDS_DECK', DECK_OF_CARDS_ARRAY)

// Shuffle the deck of cards
let SHUFFLED_DECK_OF_CARDS_ARRAY = []
let DEALERS_HAND_ARRAY = []
let PLAYERS_HAND_ARRAY = []
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
const PLAY_AGAIN_SECTION_ELEMENT = document.querySelector('.play-again')

/*
--------------------------------------------------------------------------------
 EVENT LISTENERS
--------------------------------------------------------------------------------
*/

HIT_BUTTON_ELEMENT.addEventListener('click', handleHitAction)
STAY_BUTTON_ELEMENT.addEventListener('click', handleStayAction)
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

function handleHitAction() {
  //   console.log('Hit clicked')
  if (!hasWinner()) {
    addCard('player')
  }
  hasWinner()
}

function handleStayAction() {
  //   console.log('Stay clicked')
  toggleActionButtons(true)
  const playersScore = getCurrentScore('player')

  console.log('Player scored ', playersScore)

  if (playersScore === BLACKJACK_VALUE) {
    showSuccessMsg('Player won')
  } else if (playersScore > BLACKJACK_VALUE) {
    showSuccessMsg('Dealer won')
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

function displayPlayAgain() {
  PLAY_AGAIN_SECTION_ELEMENT.classList.remove('hide')
}

function hidePlayAgain() {
  PLAY_AGAIN_SECTION_ELEMENT.classList.add('hide')
}

function runAutomaticDealersHitActions() {
  while (getCurrentScore('dealer') < 17) {
    addCard('dealer')
  }

  checkWinner()
}

function checkWinner() {
  const dealersScore = getCurrentScore('dealer')
  const playersScore = getCurrentScore('player')
  console.log('Dealer scored ', dealersScore)

  if (playersScore === dealersScore) {
    showSuccessMsg('Nobody won')
  } else if (dealersScore > BLACKJACK_VALUE || playersScore > dealersScore) {
    showSuccessMsg('Player won')
  } else {
    showSuccessMsg('Dealer won')
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
    showSuccessMsg('Dealer Won')
    displayPlayAgain()
  } else if (playersScore === BLACKJACK_VALUE) {
    toggleActionButtons(true)
    showSuccessMsg('Player Won')
    displayPlayAgain()
  }
}

function addCard(hand) {
  const randomCardValue = pickRandomCardFromDeck()
  if (hand === 'dealer') {
    DEALERS_HAND_ARRAY.push(randomCardValue)
    addCardToDOM('dealer', randomCardValue)
  } else if (hand === 'player') {
    PLAYERS_HAND_ARRAY.push(randomCardValue)
    addCardToDOM('player', randomCardValue)
  }
  return randomCardValue
}

function showSuccessMsg(msg) {
  const SUCCESS_MSG_ELEMENT = document.createElement('h1')
  SUCCESS_MSG_ELEMENT.setAttribute('id', 'msg-element')
  SUCCESS_MSG_ELEMENT.innerText = msg
  SUCCESS_MSG_DISPLAY_SECTION_ELEMENT.append(SUCCESS_MSG_ELEMENT)
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
  const scoreArray = hand === 'player' ? PLAYERS_HAND_ARRAY : DEALERS_HAND_ARRAY
  //   console.log(scoreArray)
  let score = 0
  scoreArray.forEach((arrItem) => {
    let cardStringValue = arrItem.substring(0, arrItem.length - 1)
    score += getCardFaceValue(cardStringValue)
  })
  //   console.log('The score is ', score)

  if (score > BLACKJACK_VALUE) {
    score = reduceAceValue(scoreArray, score)
    return score
  }
  // If dealer and if the current value is 17 and player's value is greater than 17
  if (hand === 'dealer') {
    const playersScore = getCurrentScore('player')
    if (score === 17 && playersScore > 17) {
      score = reduceAceValue(scoreArray, score)
    }
  }
  return score
}

function getCardFaceValue(cardStringValue) {
  if (CARDS_WITH_FACE_VALUE_10_ARRAY.includes(cardStringValue)) {
    return 10
  } else if (cardStringValue.includes('A')) {
    return 11
  } else {
    return Number(cardStringValue)
  }
}

function reduceAceValue(scoreArray, currentScore) {
  let score = currentScore
  for (let i = 0; i < scoreArray.length; ++i) {
    const cardValue = scoreArray[i].substring(0, scoreArray.length - 1)
    if (cardValue.includes('A')) {
      score -= 10
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

function shuffleDeckOfCards() {
  // TODO: Use Fisher–Yates shuffle algorithms to shuffle the deck of cards

  return DECK_OF_CARDS_ARRAY
}

function pickRandomCardFromDeck() {
  const randomCardIndex = Math.floor(
    Math.random() * SHUFFLED_DECK_OF_CARDS_ARRAY.length
  )
  //   console.log('randomCardIndex', randomCardIndex)
  const randomCard = SHUFFLED_DECK_OF_CARDS_ARRAY[randomCardIndex]
  SHUFFLED_DECK_OF_CARDS_ARRAY.splice(randomCardIndex, 1)
  return randomCard
}

function generateDeckOfCards(count) {
  const deckOfCards = []

  for (let i = 0; i < count; i++) {
    deckOfCards.push(pickRandomCardFromDeck())
  }

  return deckOfCards
}

function addCardToDOM(hand, randomCardValue) {
  const cardContainer = document.createElement('div')
  cardContainer.classList.add('card')

  const cardElement = document.createElement('h4')
  cardElement.innerText = randomCardValue
  cardElement.classList.add('card-content')
  cardContainer.append(cardElement)
  //   console.dir(cardElement)
  if (hand === 'dealer') {
    DEALERS_HAND.append(cardContainer)
    return
  }
  if (hand === 'player') {
    PLAYERS_HAND.append(cardContainer)
    return
  }
}

function removeCardsFromDOM() {
  console.log('Inside remove elements')
  const CARDS_ELEMENTS = document.querySelectorAll('.card')

  console.dir(CARDS_ELEMENTS)

  CARDS_ELEMENTS.forEach((nodeElement) => {
    nodeElement.remove()
  })
}

function setInitialStates() {
  // Shuffle the deck of cards
  SHUFFLED_DECK_OF_CARDS_ARRAY = shuffleDeckOfCards()
  // console.log('SHUFFLED_CARDS_DECK', SHUFFLED_DECK_OF_CARDS_ARRAY)

  removeCardsFromDOM()

  // INITIAL STATES - Dealer and Player has 2 cards each
  // DEALER's HAND
  DEALERS_HAND_ARRAY = generateDeckOfCards(2)

  // Add cards to DOM
  DEALERS_HAND_ARRAY.forEach((cardValue) => {
    addCardToDOM('dealer', cardValue)
  })

  // PLAYER's HAND
  PLAYERS_HAND_ARRAY = generateDeckOfCards(2)
  // Add cards to DOM
  PLAYERS_HAND_ARRAY.forEach((cardValue) => {
    addCardToDOM('player', cardValue)
  })

  // console.log("Dealer's Initial Cards", DEALERS_HAND_ARRAY)
  // console.log("Player's Initial Cards", PLAYERS_HAND_ARRAY)

  checkBlackJackCondition()
}

/*
--------------------------------------------------------------------------------
 EXECUTION
--------------------------------------------------------------------------------
*/

setInitialStates()

// TODO: Allow betting at the begining and accumulate score
