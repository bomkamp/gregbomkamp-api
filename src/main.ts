import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import {
  App,
  CfnOutput,
  CfnParameter,
  Construct,
  Duration,
  Stack,
  StackProps,
} from '@aws-cdk/core';

export class ApiLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const spotifyClientId = new CfnParameter(this, 'SPOTIFY_CLIENT_ID', {
      type: 'String',
      noEcho: true,
      minLength: 1,
    });

    const spotifyClientSecret = new CfnParameter(this, 'SPOTIFY_CLIENT_SECRET', {
      type: 'String',
      noEcho: true,
      minLength: 1,
    });

    const spotifyRefreshToken = new CfnParameter(this, 'SPOTIFY_REFRESH_TOKEN', {
      type: 'String',
      noEcho: true,
      minLength: 1,
    });

    const role: Role = new Role(this, 'LambdaIamRole', {
      roleName: this.stackName + '-lambda-role',
      description:
        'IAM Role used to allow Lambda execution & permit gateway access',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const gbApiFunction: NodejsFunction = new Function(this, 'GBApiFunction', {
      functionName: this.stackName + '-lambda',
      code: Code.fromAsset('dist'),
      handler: 'lambda.handler',
      runtime: Runtime.NODEJS_14_X,
      environment: {
        SPOTIFY_CLIENT_ID: spotifyClientId.valueAsString,
        SPOTIFY_CLIENT_SECRET: spotifyClientSecret.valueAsString,
        SPOTIFY_REFRESH_TOKEN: spotifyRefreshToken.valueAsString,
      },
      role,
      logRetentionRole: role,
      memorySize: 2048,
      timeout: Duration.seconds(15),
    });

    const apiGateway = new HttpApi(this, 'GBHttpApi', {
      apiName: this.stackName + '-http-api',
      corsPreflight: {
        allowOrigins: ['https://gregbomkamp.dev'],
      },
      defaultIntegration: new LambdaProxyIntegration({
        handler: gbApiFunction,
      }),
    });

    new CfnOutput(this, 'GBUrlOutput', {
      value: apiGateway.url ?? 'Error, no url created for gateway.',
    });
  }
}

const app = new App();

new ApiLambdaStack(app, 'my-stack-dev', {
  stackName: 'gregbomkamp-api',
  description: 'API used for fun integrations with Spotify/Instagram/IMDB/etc.',
});

app.synth();
