const { AwsCdkTypeScriptApp } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.109.0',
  defaultReleaseBranch: 'main',
  name: 'gregbomkamp-api',
  scripts: {
    'build:lambda': 'webpack-cli',
    'local': 'ts-node ./src/function/app.local.ts',
  },
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-integrations',
  ],
  deps: [
    '@vendia/serverless-express@4.3.9',
    'express@4.17.1',
    'body-parser@1.19.0',
    'cors@2.8.5',
  ],
  devDeps: [
    '@types/express@4.17.1',
    '@types/body-parser@1.19.0',
    '@types/cors@2.8.5',
    'webpack-cli@4.7.2',
    'webpack@5.39.1',
    '@types/aws-lambda@8.10.77',
    'ts-loader@9.2.3',
  ],
});

project.compileTask.prependExec('webpack-cli');
project.synth();