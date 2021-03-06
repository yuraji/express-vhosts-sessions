# Example Express.js + Vhost + Passport.js sessions

[![Book session on Codementor](https://cdn.codementor.io/badges/book_session_github.svg)](https://www.codementor.io/yurio) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://www.coinbase.com/ylinnyk)
[![Donate with Gratipay](https://img.shields.io/gratipay/yuraji.svg)](https://gratipay.com/~yuraji/)

## The problem

Passport.js happens to share strategy between different vhosts.

## Local users

Alice is an Artist  
She visits artist_app at artist.aa

Bob is a Baker  
He visits baker_app at baker.aa

They don't know about each other. But Alice finds herself logged in as Bob (a user from a site she is not even aware of).

Solution: use Passports.js to manage instances of Passport.js


# Setup

```
npm install
```

define local hosts:  
artist.aa  
baker.aa

Run `node server`

Open `artist.aa:9090` and `baker.aa:9090`


## Apps

While the contents of `artist_app` and `baker_app` is identical in this example, it doesn't have to be in the real world. They are completely independend of each other.


