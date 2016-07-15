'use strict'

var assert = require('assert')
var transactions = require('../../lib/transactions')

describe('functions to create transactions', () => {
  it('creates an input object with a public key', () =>
    assert.deepEqual(
      transactions.input('user', 0, 'publicKey'),
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
      transactions.input('user', 10, 'publicKey'),
      {
        address: 'user',
        amount: 1,
        sequence: 11
      }
    )
  )

  describe('Permissions transaction construction', () => {
    it('create an args object', () =>
      assert.deepEqual(
        transactions.Permissions.args('account', 4, 'value'),
        [2, {
          address: 'account',
          permission: 4,
          value: 'value'
        }]
      )
    )

    it('serializes parts of the transaction for signing', () => {
      assert.equal(
        transactions.Permissions.signBytes(
          'chainId',
          transactions.input('user', 0, 'publicKey'),
          transactions.Permissions.args('account', 4, 'value')
        ),
        '{"chain_id":"chainId","tx":[32,{"args":"[2,{"address":"account",' +
        '"permission":4,"value":"value"}]","input":{"address":"user",' +
        '"amount":1,"pub_key":"publicKey","sequence":1}}]}'
      )
    })

    it('creates a transaction', () => {
      assert.deepEqual(
        transactions.Permissions.transaction(
          transactions.input('user', 0, 'publicKey'),
          transactions.Permissions.args('account', 4, 'value'),
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
    })

    describe('Call transaction construction', () => {
      it('serializes parts of the transaction for signing', () => {
        assert.equal(
          transactions.Call.signBytes(
            'chainId',
            transactions.input('user', 0, 'publicKey'),
            'address',
            'data'
          ),
          '{"chain_id":"chainId","tx":[2,{"address":"address","data":"data",' +
          '"fee":null,"gas_limit":null,"input":{"address":"user","amount":1,' +
          '"pub_key":"publicKey","sequence":1}}]}'
        )
      })

      it('creates a transaction', () => {
        assert.deepEqual(
          transactions.Call.transaction(
            transactions.input('user', 0, 'publicKey'),
            'address',
            'data',
            'signature'
          ),
          [2, {
            input: {
              address: 'user',
              amount: 1,
              pub_key: 'publicKey',
              sequence: 1,
              signature: [1, 'signature']
            },
            address: 'address',
            gas_limit: null,
            fee: null,
            data: 'data'
          }]
        )
      })
    })
  })
})
