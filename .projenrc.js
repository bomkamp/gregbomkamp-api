const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.109.0',
  defaultReleaseBranch: 'main',
  name: 'gregbomkamp-api',
  scripts: {
    'local': 'tsnd ./src/function/app.local.ts',
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
    'spotify-web-api-node@5.0.2',
    'express-async-errors@3.1.1',
    'ejs@3.1.6',
    'js-yaml@4.1.0',
    'swagger-ui-express@4.1.6',
  ],
  devDeps: [
    '@types/express@4.17.1',
    '@types/body-parser@1.19.0',
    '@types/cors@2.8.5',
    '@types/spotify-web-api-node@5.0.2',
    '@types/js-yaml@4.0.1',
    '@types/swagger-ui-express@4.1.2',
    '@types/ejs@3.0.6',
    'webpack-cli@4.7.2',
    'webpack@5.39.1',
    '@types/aws-lambda@8.10.77',
    'ts-loader@9.2.3',
    'ts-node-dev@1.1.6',
    'dotenv@10.0.0',
    'copy-webpack-plugin@9.0.0',
  ],
  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
  eslintOptions: {
    ignorePatterns: [
      "app.local.ts"
    ]
  },
  gitignore: [
    '**/*.env',
  ],
});

project.tsconfig.compilerOptions.types = [
  'spotify-api'
];

project.buildTask.prependExec('webpack-cli');

project.removeTask('deploy');
project.addTask('deploy', {
  exec: "npm run build && bash ./deploy.sh",
});

project.synth();