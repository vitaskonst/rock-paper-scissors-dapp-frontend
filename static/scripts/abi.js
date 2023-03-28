abi = [
    {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "player1",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum RockPaperScissorsGame.GameOption",
                "name": "player1Hand",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "player2",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum RockPaperScissorsGame.GameOption",
                "name": "player2Hand",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "result",
                "type": "string"
            }
        ],
        "name": "GameResult",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "enum RockPaperScissorsGame.GameOption",
                "name": "_option",
                "type": "uint8"
            }
        ],
        "name": "createGame",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            }
        ],
        "name": "getGameState",
        "outputs": [
            {
                "internalType": "enum RockPaperScissorsGame.GameState",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_addr",
                "type": "address"
            }
        ],
        "name": "getGamesByAddress",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "gameId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum RockPaperScissorsGame.GameState",
                        "name": "state",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "player1",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "player2",
                        "type": "address"
                    },
                    {
                        "internalType": "enum RockPaperScissorsGame.GameOption",
                        "name": "player1Choice",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum RockPaperScissorsGame.GameOption",
                        "name": "player2Choice",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deposit",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct RockPaperScissorsGame.Game[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWaitingGames",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deposit",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct RockPaperScissorsGame.GameInfo[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            },
            {
                "internalType": "enum RockPaperScissorsGame.GameOption",
                "name": "_option",
                "type": "uint8"
            }
        ],
        "name": "joinGame",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nonce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]