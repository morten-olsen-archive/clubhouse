module.exports = () => ({
  files: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
  ],

  tests: [
    'src/**/*.spec.ts',
  ],

  env: {
    type: 'node',
  },
  setup: () => {
    require('rxdb').plugin(require('pouchdb-adapter-memory'));
  },
  testFramework: 'jasmine',
});