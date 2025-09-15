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
      src: path.resolve(__dirname, 'src'),
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
  externals: {
    // MongoDB optional dependencies
    'kerberos': 'commonjs kerberos',
    '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
    '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
    'snappy': 'commonjs snappy',
    'aws4': 'commonjs aws4',
    'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
    // Apollo Server optional dependencies
    'encoding': 'commonjs encoding',
  },
  optimization: {
    minimize: false,
  },
});
