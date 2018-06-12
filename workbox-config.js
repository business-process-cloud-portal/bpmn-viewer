module.exports = {
    globDirectory: './dist/',
    globPatterns: [
      '**/*.{html,js,css,ico,png}'
    ],
    swDest: './dist/worker.js',
    clientsClaim: true,
    skipWaiting: true
  };