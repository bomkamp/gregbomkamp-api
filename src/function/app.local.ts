import { app } from './app';
const port = 3002;

app.listen(port, () => {
  console.info(`listening on http://localhost:${port}`);
});