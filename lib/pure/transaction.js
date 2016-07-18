'use strict'

var canonicalJson = require('canonical-json')
var R = require('ramda')

exports.Input = (address, amount, sequence, publicKey) => {
  const prototype = {
    toString () {
      return canonicalJson({
        address: this.address,
        amount: this.amount,
        sequence: this.sequence
      })
    },

    toJson () {
      return this
    }
  }

  const input = {
    address: address.toUpperCase(),
    amount,
    sequence
  }

  return Object.assign(Object.create(prototype), sequence === 1
    ? R.assoc('pub_key', [1, publicKey], input)
    : input
  )
}

exports.Args = (address, permission, value) => {
  const prototype = {
    toString () {
      return canonicalJson(this.toJson())
    },

    toJson () {
      return [2, {
        address: this.address,
        permission: this.permission,
        value: this.value
      }]
    }
  }

  return Object.assign(
    Object.create(prototype),
    {
      address: address.toUpperCase(),
      permission,
      value
    }
  )
}

exports.Permissions = (chainId, input, args) => {
  const type = 32

  const prototype = {
    toString () {
      return ['{"chain_id":', canonicalJson(chainId), ',"tx":[',
      canonicalJson(type), ',{"args":', String(this.args), ',"input":',
      String(this.input), '}]}'].join('')
    },

    toJson () {
      return [type, {input: this.input.toJson(), args: this.args.toJson()}]
    }
  }

  return Object.assign(Object.create(prototype), {input, args})
}

exports.Call = (chainId, address, data, gasLimit, fee, input) => {
  const type = 2

  const prototype = {
    toString () {
      return ['{"chain_id":', canonicalJson(chainId), ',"tx":[',
        canonicalJson(type), ',{"address":',
        canonicalJson(this.address), ',"data":', canonicalJson(this.data),
        ',"fee":', canonicalJson(this.fee), ',"gas_limit":',
        canonicalJson(this.gasLimit), ',"input":',
        String(this.input), '}]}'].join('')
    },

    toJson () {
      return [type, {
        input: this.input.toJson(),
        address: this.address,
        gas_limit: this.gasLimit,
        fee: this.fee,
        data: this.data
      }]
    }
  }

  return Object.assign(
    Object.create(prototype),
    {
      address: address.toUpperCase(),
      data: data.toUpperCase(),
      gasLimit,
      fee,
      input
    }
  )
}
