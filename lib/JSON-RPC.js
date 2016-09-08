'use strict'

const I = require('iteray')
const R = require('ramda')

const client = (options) => {
  let pending = {}
  let nextId = 0
  let requestResolve

  const requests = I.Reactor((resolve) => {
    requestResolve = resolve
  })

  const methods = R.fromPairs(R.map(
    (name) =>
      [name, (params) =>
        new Promise((resolve, reject) => {
          pending[nextId] = resolve

          requestResolve({
            done: false,
            value: {
              jsonrpc: '2.0',
              method: name,
              params,
              id: nextId
            }
          })

          nextId++
        })],
    options.methodNames
  ))

  const processResponse = () => {
    options.responses.next().then((result) => {
      if (!result.done) {
        const response = result.value
        const id = response.id
        pending[id](response.result)
        delete pending[id]
        setImmediate(processResponse)
      }
    })
  }

  processResponse()
  return {methods, requests}
}

module.exports = client
