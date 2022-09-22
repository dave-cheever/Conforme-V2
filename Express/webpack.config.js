const path = require('path');

module.exports = (env) => ({
  entry: './src/index.ts',
  mode: env.NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  resolve: {
    alias: {
      'node-fetch$': 'node-fetch/lib/index.js',
      graphql$: 'graphql/index.js',
      'app-interfaces': path.resolve(__dirname, 'src/interfaces/inedx.ts'),
      'app-utils': path.resolve(__dirname, 'src/utils/index.ts'),
      'app-services': path.resolve(__dirname, 'src/services/index.ts'),
      'app-models': path.resolve(__dirname, 'src/models/index.ts'),
      'app-shared': path.resolve(__dirname, 'src/shared/index.ts'),
      'app-migrations': path.resolve(__dirname, 'src/migrations/index.ts'),
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
});
