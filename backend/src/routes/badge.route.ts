import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { fetchBadges } from "../controllers/badge.controller.js";

export const route = express.Router();

route.use(protectRoute);

route.get("/fetch-badges", fetchBadges);
