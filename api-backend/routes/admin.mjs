// this module contains all the administrative endpoints

// import third party modules
import express from "express";
import multer from "multer";

// import this package's modules
import * as controller from "../controllers/admin.mjs";

// configure multer (module that helps with handling multipart/form-data files)
const multerOptions = {
    storage: multer.memoryStorage() // store received files in RAM (and not on the disk)
};
const upload = multer(multerOptions);

// create the router
const router = express.Router();

// endpoint to check the health of the connection to the database
router.get("/healthcheck", controller.getHealthcheck);

// endpoint to post a new questionnaire (as a JSON file)
// file contents in req.file
router.post("/questionnaire_upd", upload.single("file"), controller.postQuestionnaireUpd);

// endpoint to delete everything in the database
router.post("/resetall", controller.postResetAll);

// endpoint to delete a questionnaire's sessions
router.post("/resetq/:questionnaireID", controller.postResetQ);

export default router;
