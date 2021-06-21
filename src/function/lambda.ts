import { configure } from '@vendia/serverless-express';
import { app } from './app';

export const handler: any = configure({ app });
