import express, { Router } from "express";
import CollectionController from "../architecture/controllers/collection.controller";

const router: Router = express.Router();
const collectionController = new CollectionController();

router.post("/", collectionController.createCollection);

export default router;
