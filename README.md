#Quadratic Voting

This is an implementation of a voting mechanism described in the book Radical Markets.
Each voter gets 16 "Voice Credits", which they can spend on various issues.
The interesting thing is that each time a user votes on a single issue the price for the vote raises in a quadratic scale.

So for example if a voter wants to vote twice for a single issue the cost would be 2^2 (4 credits), 3 votes would cost 3^2 (9 credits).

Upon registration a voter gets 16 credits and theres an allotment of 1024 total vote credits. In a update to this contract and dapp ERC20 standard can be used for the Voice Credits so that votes can be "bought".

### Pre-Requirements
- metamask
- node.js > `v12.0.0` + NPM
- truffle
- ganache-cli

### Setup
```
npm i
ganache-cli
npm run dev
truffle migrate --reset
```

###### IMPORTANT
Due to some limitation in ganache-cli the only addresses that can interact with the contract are the ones in ganache so you will have to import this in MetaMask in order to test locally.

### Testing
```
truffle test
```