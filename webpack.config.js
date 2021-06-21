const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/function/lambda.ts',
  target: 'node',
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'lambda.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/function/openapi', to: 'openapi' },
        { from: './src/function/views', to: 'views' },
        {
          from: './node_modules/swagger-ui-dist/',
        },
      ]
    })
  ]
}
