import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { ApiLambdaStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new ApiLambdaStack(app, 'test');

  expect(stack).not.toHaveResource('AWS::S3::Bucket');
  expect(stack).toHaveResource('AWS::Lambda::Function');
  expect(
    app.synth().getStackArtifact(stack.artifactId).template,
  ).toMatchSnapshot();
});
