import express from 'express';
import { checkAnswer } from '../controllers/train.controller.ts';

export const route = express.Router();

route.post("/check-answer", checkAnswer);