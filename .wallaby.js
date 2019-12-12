module.exports = function (wallaby) {
  return {
    files: [
      'packages/*/src/**/*.ts',
      '!packages/*/src/**/*.spec.ts',
    ],

    tests: [
      'packages/*/src/**/*.spec.ts',
    ],
    env: {
      type: 'node'
    },
    testFramework: 'mocha'
  };
};