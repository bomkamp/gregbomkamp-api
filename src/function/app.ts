require('express-async-errors'); // eslint-disable-line @typescript-eslint/no-require-imports
import { readFileSync } from 'fs';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import yaml from 'js-yaml';
import { serve, setup } from 'swagger-ui-express';
import { SpotifyRouter } from './spotify/spotify.router';
import {
  exceptionMiddleware,
  notFoundMiddleware,
} from './util/error.utils';

export const app = express();

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express); // eslint-disable-line @typescript-eslint/no-require-imports
app.set('views', __dirname + '/views');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// SwaggerDocs
app.use(serve);
app.get('/', setup(yaml.load(
  readFileSync(__dirname + '/openapi/openapi.yaml', 'utf8')) as Object, { customSiteTitle: 'API Docs' }),
);

app.use(SpotifyRouter);

app.get('*', notFoundMiddleware);

app.use(exceptionMiddleware);
