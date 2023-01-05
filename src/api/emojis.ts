import express from 'express';
import { getAgent } from './../veramo/setup';

const router = express.Router();

type EmojiResponse = string[];

router.get<{}, EmojiResponse>('/', (req, res) => {

  let agent = getAgent();

  res.json(['😀', '😳', '🙄']);
});

export default router;
