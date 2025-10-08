import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.ts";
import {
  createPuzzle,
  deletePuzzle,
  dislike,
  getComments,
  getDiscoverCategoryPuzzles,
  getPopularPuzzles,
  getPuzzles,
  getScrollPuzzles,
  getUserPuzzles,
  like,
  postComment,
} from "../controllers/puzzle.controller.ts";

export const route = express.Router();

route.use(protectRoute);

route.get("/get-user-puzzles", getUserPuzzles);
route.post("/create-puzzle", createPuzzle);
route.post("/get-puzzles", getPuzzles);
route.delete("/delete-puzzle/:id", deletePuzzle);
route.get("/get-popular-puzzles", getPopularPuzzles);
route.get("/get-discover-category-puzzles", getDiscoverCategoryPuzzles);
route.post("/get-scroll-puzzles", getScrollPuzzles);
route.post("/post-comment", postComment);
route.get("/get-comments/:id", getComments);
route.put("/like-puzzle", like);
route.put("/dislike-puzzle", dislike);
