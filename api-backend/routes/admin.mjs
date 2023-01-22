// this module contains all the administrative endpoints

// import third party modules
import express from "express";
import multer from "multer";

// import this package's modules
import * as controller from "../controllers/admin.mjs";

// create the router
const router = express.Router();

// endpoint to check the health of the connection to the database
router.get("/healthcheck", controller.getHealthcheck);

// endpoint to post a new questionnaire (as a JSON file)
router.post("/questionnaire_upd", controller.postQuestionnaireUpd); // TODO: configure and add multer

// endpoint to delete everything in the database
router.post("/resetall", controller.postResetAll);

// endpoint to delete a questionnaire's sessions
router.post("/resetq/:questionnaireID", controller.postResetQ);

export default router;
