const path = require('path')

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
    // library: 'serverlessExpressEdge',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    // TODO bring back for open api
    // new CopyPlugin({
    //   patterns: [
    //     { from: './src/views', to: 'views' },
    //     { from: './src/vendia-logo.png' }
    //   ]
    // })
  ]
}
