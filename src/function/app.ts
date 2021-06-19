import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

export const app = express();
const router = express.Router();

router.use(cors());
router.use(json());
router.use(urlencoded({ extended: true }));

router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'UP',
  });
});

app.use('/', router);
