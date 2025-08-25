module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!multiformats|uuid|@multiformats|@babel)/'
  ],
};