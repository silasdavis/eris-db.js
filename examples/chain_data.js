// Some data for setting up a new node.

exports.priv_validator = {
    "address": "37236DF251AB70022B1DA351F08A20FB52443E37",
        "pub_key": [1, "CB3688B7561D488A2A4834E1AEE9398BEF94844D8BDBBCA980C11E3654A45906"],
        "priv_key": [1, "6B72D45EB65F619F11CE580C8CAED9E0BADC774E9C9C334687A65DCBAD2C4151CB3688B7561D488A2A4834E1AEE9398BEF94844D8BDBBCA980C11E3654A45906"],
        "last_height": 0,
        "last_round": 0,
        "last_step": 0
};

exports.genesis = {
    "chain_id": "eris-db-example",
        "accounts": [
        {
            "address": "37236DF251AB70022B1DA351F08A20FB52443E37",
            "amount": 110000000000
        }
    ],
        "validators": [
        {
            "pub_key": [1, "CB3688B7561D488A2A4834E1AEE9398BEF94844D8BDBBCA980C11E3654A45906"],
            "amount": 5000000000,
            "unbond_to": [
                {
                    "address": "93E243AC8A01F723DE353A4FA1ED911529CCB6E5",
                    "amount": 5000000000
                }
            ]
        }
    ]
};

// Registers caller as owner, and updates to the latest caller every time.
exports.solidity =
    " contract Test {               " +
    "   address public latest;      " +
    "                               " +
    "   function Test() {           " +
    "     latest = msg.sender;      " +
    "   }                           " +
    "                               " +
    "   function() {                " +
    "     latest = msg.sender;      " +
    "   }                           " +
    " };                            ";

exports.contractByteCode = "606060405260008054600160a060020a03191633179055606e8060236000396000f30060606040523615601d5760e060020a60003504638da5cb5b81146040575b605e6000805473ffffffffffffffffffffffffffffffffffffffff191633179055565b606460005473ffffffffffffffffffffffffffffffffffffffff1681565b60006000f35b6000818152602090f3";