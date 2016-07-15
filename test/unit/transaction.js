'use strict'

var assert = require('assert')
var transactions = require('../../lib/transactions')

describe('functions to create transactions', () => {
  it('create an args object', () =>
    assert.deepEqual(
      transactions.createArgs('account', 'value'),
      [2, {
        address: 'account',
        permission: 4,
        value: 'value'
      }]
    )
  )

  it('creates an input object with a public key', () =>
    assert.deepEqual(
      transactions.createInput('user', 0, 'publicKey'),
      {
        address: 'user',
        amount: 1,
        pub_key: 'publicKey',
        sequence: 1
      }
    )
  )

  it('creates an input object without a public key', () =>
    assert.deepEqual(
      transactions.createInput('user', 10, 'publicKey'),
      {
        address: 'user',
        amount: 1,
        sequence: 11
      }
    )
  )

  it(`serializes parts of the transaction for signing using Eris DB's
    idiosyncratic algorithm`, () => {
    assert.equal(
      transactions.writeSignBytes(
        'chainId',
        transactions.createInput('user', 0, 'publicKey'),
        'type',
        transactions.createArgs('account', 'value')
      ),
      '{"chain_id":"chainId","tx":["type",{"args":"[2,{"address":"account",' +
      '"permission":4,"value":"value"}]","input":{"address":"user",' +
      '"amount":1,"pub_key":"publicKey","sequence":1}}]}'
    )
  })

  describe('creates a permission changing transaction', () => {
    it('the first transaction in the sequence includes the public key', () =>
      assert.deepEqual(
        transactions.createSetCallPermission(
          transactions.createInput('user', 0, 'publicKey'),
          32,
          transactions.createArgs('account', 'value'),
          'signature'
        ),
        [32, {
          input: {
            address: 'user',
            amount: 1,
            pub_key: 'publicKey',
            sequence: 1,
            signature: [1, 'signature']
          },
          args: [2, {
            address: 'account',
            permission: 4,
            value: 'value'
          }]
        }]
      )
    )

    it('later transactions in the sequence omit the public key', () =>
      assert.deepEqual(
        transactions.createSetCallPermission(
          transactions.createInput('user', 10, 'publicKey'),
          32,
          transactions.createArgs('account', 'value'),
          'signature'
        ),
        [32, {
          input: {
            address: 'user',
            amount: 1,
            sequence: 11,
            signature: [1, 'signature']
          },
          args: [2, {
            address: 'account',
            permission: 4,
            value: 'value'
          }]
        }]
      )
    )
  })
})
