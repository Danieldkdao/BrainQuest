import express from 'express';
import { getPuzzles } from '../controllers/puzzles.controller.ts';

export const route = express.Router();

route.post("/get-puzzles", getPuzzles);