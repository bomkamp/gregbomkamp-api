// Needs to be setup before importing app
import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

const port = 3002;

app.listen(port, () => {
  console.info(`listening on http://localhost:${port}`);
});
