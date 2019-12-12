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
    workers: {
      initial: 1,
      regular: 1,
    },
    setup: function(wallaby) {
      wallaby.testFramework.DEFAULT_TIMEOUT_INTERVAL = 5000;
      wallaby.testFramework.timeout(10000)
      //var mocha = wallaby.testFramework;
      //mocha.setup({ timeout: 5000 });
    },
    testFramework: 'mocha'
  };
};