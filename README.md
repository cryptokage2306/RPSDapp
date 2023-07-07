# Rock Paper Scissor Spock Lizard Dapp

Welcome to the Rock Paper Scissor Spock Lizard Dapp! This decentralized application allows you to play the game with your opponent using smart contracts on the Ethereum blockchain.

## Game Page

### Game Creation

To create a game, you need to visit the `/game` page. Here are the required steps:

1. Enter your password: Provide a password that will be used to secure the game.
2. Enter your opponent's Ethereum address: Specify the Ethereum address of the player you want to challenge.
3. Set the amount: Determine the amount of Ether you want to wager on the game.

Once you have provided the necessary information, submit the form to create the game. The smart contract will hold the wagered amount until the game is resolved.

## Contract - First Player

### Solving the Game or Withdrawing the Amount

After creating the game, as the first player, you will have access to the `/{contract}/firstplayer` page. Here, you have two options:

1. Solve the game: Use the provided interface to play your move in the Rock Paper Scissor Spock Lizard game. If both players have submitted their moves, the smart contract will determine the winner and distribute the wagered amount accordingly.
2. Withdraw the amount: If the opponent has not played their move within the specified timeout, you can choose to withdraw the wagered amount.

Make sure to keep track of the game status and resolve it within the specified timeout to ensure a fair outcome.

## Contract - Opponent

### Submitting the Move or Withdrawing the Amount

As the opponent, you will have access to the `/{contract}/opponent` page after the game has been created. Here, you can take the following actions:

1. Submit your move: Use the provided interface to play your move in the Rock Paper Scissor Spock Lizard game. Remember to provide the same amount of Ether as wagered by the first player.
2. Withdraw the amount: If the first player fails to solve the game within the specified timeout, you can choose to withdraw the wagered amount.

Ensure you make your move within the specified time frame and follow the rules of the game to ensure a fair outcome.

---

Note: Remember to have a compatible Ethereum wallet and sufficient Ether balance to interact with the Dapp. Enjoy playing Rock Paper Scissor Spock Lizard!

## License

This project is licensed under the [MIT License](LICENSE).
