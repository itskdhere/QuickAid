import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import { nearbyGeocode, nearbySearch } from "../controllers/nearby.controller";

const nearby = Router();

nearby.route("/geocode").post(checkAuth, nearbyGeocode);
nearby.route("/search").post(checkAuth, nearbySearch);

export default nearby;
