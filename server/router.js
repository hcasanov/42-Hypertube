import express from "express";
import path from "path";

import signUpController from "./Controllers/signUp";
import searchController from "./Controllers/search";
import movieControllers from "./Controllers/movie";

const router = express.Router();

router.get("/search", searchController.search);

router.get("/check-token", (req, res) => {
  res.status(200).send({ validToken: true });
});

/* Sign Up */
router.post("/inscription", signUpController.signUp);

/* Movie */
router.get("/movie/infos/:id", movieControllers.getInfos);
router.get("/movie/download/:id", movieControllers.downloadVideo);
router.get("/movie/streaming/:id", (req, res) => {
  const movieName = req.params.id;
  const absolutePath = path.resolve(`./server/data/movie/${movieName}`);
  res.status(200).sendFile(absolutePath);
});
router.post("/movie/review", movieControllers.receiveReviews);

// router.get("/data/avatar/:id", (req, res) => {
//   const pictureName = req.params.id;
//   const absolutePath = path.resolve(`./data/avatar/${pictureName}`);
//   res.status(200).sendFile(absolutePath);
// });

export default router;
