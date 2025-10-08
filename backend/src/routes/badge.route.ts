import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.ts';
import { fetchBadges } from '../controllers/badge.controller.ts';

export const route = express.Router();

route.use(protectRoute);

route.get("/fetch-badges", fetchBadges);