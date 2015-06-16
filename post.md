---

title:     "Eris blockchain server and javascript."
layout:    post
published: true
comments:  true
meta:      true
thumbnail: erisdb.jpg
author:    andreas
category:  releases
series:    -
tags:      [eris, eris-db, javascript, js]
excerpt:   "Information about the new Tendermint-based system."

---

## Introduction

*By: [Andreas Olofsson](mailto:andreas@erisindustries.com), Core Developer - Education and Outreach*

The focus of Eris right now has been on two major things:

1. Replacing the Ethereum PoW client with Tendermint.
2. Phasing out the deCerver.

Replacing Ethereum with Tendermint is essential, though it's mostly about replacing the consensus system. It still uses the EVM (Ethereum Virtual Machine), and understands Solidity code. The reason we needed to switch is that the PoS consensus system in Tendermint is much better suited for our chains, because consensus is generally driven by a set of trusted nodes and not work.

Phasing out the decerver involves moving dependency management over to docker, and moving the dapp logic into node.js, meaning dapps are just normal node.js applications that uses Eris javascript libraries to access our blockchain.

A lot of this is now done.
 
## Introducing the eris-db server

The Tendermint client is now integrated into our stack, and can be run through a library we call `eris-db`. It is basically a Tendermint node wrapped by a webserver that allows requests to be made using JSON-RPC (2.0) over HTTP or websocket. It is meant to act like a regular web-server, and can handle multiple users at once, a mix of http and websocket requests, and so on. One use-case would be a dapp running on a small network of nodes that people access through a webpage. As the user-base increases, it is fairly simple to add more nodes to be able to handle more requests and provide additional data- and operational redundancy.

The server has a number of nice features. It allows full access to the exposed Tendermint methods, which includes fetching account, blockchain, consensus and network data, transacting with the client, and subscribing to events. It also allows filters to be used when fetching data such as accounts and blocks. With JSON-RPC you add the filters as objects, and with REST-like HTTP requests you use a query structure similar to that of the [Github API](https://help.github.com/articles/search-syntax/).

There are some caveats though. Container management is still somewhat of a hassle, but we are making a tool for that. It is basically a re-iteration of the EPM command-line tool, but it's made to manage docker containers rather then normal executable files. Also, Tendermint has been integrated, but we still do not have all the "GenDoug" capabilities. We expect to have added those within the next couple of weeks.

## The javascript library

The javascript library provides bindings for all the RPC methods over HTTP and websocket. It can be added to a node.js application through npm or otherwise (`npm install erisdb-js`).
 
## Extras

### The server-server

`eris-db` comes with a server that could be useful when doing tests. It accepts POST requests with chain configuration data in the body (validator.json and genesis.json, etc.). When receiving a request it will create a new working directory in the OSs temp directory, write the data into it, start a fresh Tendermint node in that directory, serve it on a port that is taken from a pool, and return the serve address in the response. It is then possible to use that node to do tests.

This server-server aims to solve a few problems that I've come across when working with dapps and smart contracts. Here are some examples: 

When developing dapps, I find that I usually need a clean, new node to test contract code in a reliable way. I'd say this is the case in 90-95% of the tests. Using an already running node works sometimes, but it is far better when you know that the starting-state of the node will be **exactly the same** for each test.
 
I like to be able work with node.js (and javascript stuff in general) in Windows. Our remote compiler makes that possible to some extent, but i still have to run a node to do tests, and i'd rather have that on a remote then having to mess around with docker etc. I think it's the same with mac users. I can see this being useful for a team as well, as it is possible to set the server-server up on a dedicated machine, and have everyone do their tests on that, because it makes sure the test environment is **exactly the same**, and again.

### Test data

The test-data used is in json, so that it works both on the server and the clients. It is how tests (integration tests in particular) is carried out, meaning if someone needs to make a client in some other language, they can use the data to make sure it works.

## Coming up

The eris-db javascript library is basically just bindings for the Thelonious RPC methods. There are some things that will be added to make working with dapps easier.

* Perhaps the most urgent additions is the "web3-style" javascript contracts. They will make it a lot easier to call contracts and parse solidity events. This requires a PR to Tendermint as it has not yet integrated solidity events into its event system, so it will take a little while.
* Another urgent addition is javascript bindings for the remote compiler.
* Docker container, obviously.
* We've begun work on a web-UI for viewing and to some extent interacting with a running chain.
* The javascript library will be fully compatible with web-browsers and not just node.js. Work has already begun, and I've run it in Chrome, but it needs much more work before we will formally support it.
* Support for CORS and TLS is included in the server, but needs to 
* Unit testing solidity contracts is useful, at least when working with large systems. My sUnit library allows unit testing from node.js, and can be hooked into whatever testing framework is used. I will port it over to erisdb and upload at some point. This is fairly low priority, and might not even make it into 1.0.