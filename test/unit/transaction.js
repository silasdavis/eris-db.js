'use strict'

var assert = require('assert')
var transactions = require('../../lib/transactions')

describe('functions to create transactions', () => {
  describe('Input object', () => {
    it('creates an input object with a public key', () =>
      assert.deepEqual(
        transactions.Input('address', 1, 1, 'publicKey'),
        {
          address: 'ADDRESS',
          amount: 1,
          pub_key: [1, 'publicKey'],
          sequence: 1
        }
      )
    )

    it('creates an input object without a public key', () =>
      assert.deepEqual(
        transactions.Input('address', 1, 10, 'publicKey'),
        {
          address: 'ADDRESS',
          amount: 1,
          sequence: 10
        }
      )
    )

    it('serializes the object', () => {
      assert.equal(
        String(transactions.Input('address', 1, 1, 'publicKey')),
        '{"address":"ADDRESS","amount":1,"sequence":1}'
      )
    })
  })

  describe('Permissions transaction', () => {
    it('create an args object', () =>
      assert.deepEqual(
        transactions.Args('address', 4, 'value').toJson(),
        [2, {
          address: 'ADDRESS',
          permission: 4,
          value: 'value'
        }]
      )
    )

    it('serializes parts of the transaction for signing', () => {
      assert.equal(
        String(transactions.Permissions(
          'chainId',
          transactions.Input('address', 1, 1, 'publicKey'),
          transactions.Args('address', 4, 'value')
        )),
        '{"chain_id":"chainId","tx":[32,{"args":[2,{"address":"ADDRESS",' +
        '"permission":4,"value":"value"}],"input":{"address":"ADDRESS",' +
        '"amount":1,"sequence":1}}]}'
      )
    })

    it('creates a transaction', () => {
      assert.deepEqual(
        transactions.Permissions('chainId',
          transactions.Input('address', 1, 1, 'publicKey'),
          transactions.Args('address', 4, 'value')
        ).toJson(),
        [32, {
          input: {
            address: 'ADDRESS',
            amount: 1,
            pub_key: [1, 'publicKey'],
            sequence: 1
          },
          args: [2, {
            address: 'ADDRESS',
            permission: 4,
            value: 'value'
          }]
        }]
      )
    })

    describe('Call transaction', () => {
      it('serializes parts of the transaction for signing', () => {
        assert.equal(
          String(transactions.Call(
            'chainId',
            'address',
            'data',
            0,
            1,
            transactions.Input('address', 1, 1, 'publicKey')
          )),
          '{"chain_id":"chainId","tx":[2,{"address":"ADDRESS","data":"DATA",' +
          '"fee":1,"gas_limit":0,"input":{"address":"ADDRESS",' +
          '"amount":1,"sequence":1}}]}'
        )
      })

      it('creates a transaction', () => {
        assert.deepEqual(
          transactions.Call(
            'chainId',
            'address',
            'data',
            'gasLimit',
            'fee',
            transactions.Input('address', 1, 1, 'publicKey')
          ).toJson(),
          [2, {
            input: {
              address: 'ADDRESS',
              amount: 1,
              pub_key: [1, 'publicKey'],
              sequence: 1
            },
            address: 'ADDRESS',
            gas_limit: 'gasLimit',
            fee: 'fee',
            data: 'DATA'
          }]
        )
      })
    })
  })
})
