<!-- README Suggestions:
 -->

# BLACKJACK GAME

## Technologies Used

JAVASCRIPT, HTML, CSS

## About the Game

    Blackjack is a card game. A dealer plays aganist one or more players. As a player, the object is to beat the dealer.

Here is the link to wikipedia page [Blackjack Wiki](https://en.wikipedia.org/wiki/Blackjack)

### Card values

    2-10 => Face value
    Jack, Queen, King => 10
    Ace => 1 or 11

### How to Win

    Get closer to 21 without going over 21

### You lose

    If you go over 21
    If the Dealer gets closer to 21 than you

## How to Play

##### PLAYER

- Player plays first
- Has the option to either HIT or STAND

##### DEALER

- If the total is 17 or more, Dealer must stay. If the total is 16 or under, they must take a card.
- The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stay.

## Winning Case

Player wins

- If he hits jackpot with the initial 2 cards unless dealer's card doesn't add up to 21 (in which case dealer's win)
- If player hits and the card value sums up to 21
- If player stands and the dealer's sum is over 21

## Screenshots

    Initial Screen - Use START GAME button to start the game

![alt text for screen readers](./images/screenshots/initial-screen.png 'Text to show on mouseover')

    Initial Card state - The dealer and player will have two cards initially. One of the dealer's card will hidden

![alt text for screen readers](./images/screenshots/initial-cards.png 'Text to show on mouseover')

    Game in progress - Player has two option - HIT or STAND. Cards will be added to players board upon pressing the HIT option

![alt text for screen readers](./images/screenshots/game-in-progress.png 'Text to show on mouseover')

    Final Screen - A success or failure message shows up once the game is over. Player can play again by pressing the PLAY AGAIN button or exit the game by pressing EXIT button

![alt text for screen readers](./images/screenshots/final-state.png 'Text to show on mouseover')

## Future Iterations

Planning to implement the below features

- SPLIT
- DOUBLE DOWN
- SURRENDER
- multi-players
- recommendations to hit or stand

## Game link

You can play the game on [Blackjack Online Game](https://suchithrasuchithra.github.io/blackjack/)
