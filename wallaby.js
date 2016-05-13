module.exports = function () {
  return {
    files: [
      'index.js', 'lib/**/*.js', 'test/testdata/*',
      {pattern: 'lib/parser.pegjs', instrument: false},
      {pattern: 'test/mock/*', instrument: false}
    ],

    tests: [
      'test/unit/*.js'
    ],

    env: {
      type: 'node'
    },

    testFramework: 'mocha'
  }
}
