// this module contains all the administrative controllers

// import third party modules
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

// check database connectivity
function getHealthcheck(req, res) {
    const statusCode = StatusCodes.OK;
    const db = mongoose.connection;
    // reasyState is equal to 1 if connection to database is healthy
    const response = {
        status: db.readyState === 1 ? "OK" : "failed",
        dbconnection: `mongodb://${db.host}:${db.port}/${db.name}`
    };
    res.status(statusCode).json(response);
}

// upload a questionnaire to the database
async function postQuestionnaireUpd(req, res) {
    let statusCode = StatusCodes.NO_CONTENT;
    let reasonValue = undefined;
    let response = undefined;

    // turn the uploaded document into a JSON object
    // req.file.buffer contains the uploaded file data as bytes
    // toString() is required to make it readable
    // JSON.parse() turns a JSON string into a proper JSON object
    const jsonified = JSON.parse(req.file.buffer.toString());
    // create a questionnaire with the given values
    const questionnaire = new Questionnaire(jsonified);

    // save the questionnaire
    const { success } = await saveDocument(questionnaire);
    if (!success) {
        console.log(error);
        statusCode = StatusCodes.BAD_REQUEST;
        reasonValue = "Bad questionnaire parameters"; // When proper validation is added, this will become more specific
        response = { error: reasonValue };
    }
    res.status(statusCode).send(response);

    // helper functions --------------------

    async function saveDocument(document) {
        try {
            await document.save();
            console.log("A new questionnaire was saved to the database");
            return { success: true };
        } catch (error) {
            console.log("Failed to save a new questionnaire to the database:", error);
            return { success: false };
        }
    }
}

// delete all documents form the database
async function postResetAll(req, res) {
    let statusCode = StatusCodes.OK;
    let response = {
        status: "OK",
        reason: undefined
    };

    const { qSuccess } = await deleteAllQuestionnaires();
    const { sSuccess } = await deleteAllSessions();

    if (!qSuccess || !sSuccess) {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        response.status = "failed";
        response.reason = "An error occured while querying the database, ";
    }

    if (!qSuccess && !sSuccess) response.reason += "no documents were deleted";
    else if (!qSuccess) response.reason += "only sessions were deleted";
    else if (!sSuccess) response.reason += "only questionnaires were deleted";

    res.status(statusCode).json(response);

    // helper functions --------------------

    async function deleteAllQuestionnaires() {
        try {
            const { deletedCount } = await Questionnaire.deleteMany();
            console.log(`Deleted all ${deletedCount} questionnaires from the database`);
            return { success: true };
        } catch (error) {
            console.error("An error occured while trying to delete all questionnaires:", error);
            return { success: false };
        }
    }

    async function deleteAllSessions() {
        try {
            const { deletedCount } = await Session.deleteMany();
            console.log(`Deleted all ${deletedCount} sessions from the database`);
            return { success: true };
        } catch (error) {
            console.error("An error occured while trying to delete all sessions:", error);
            return { success: false };
        }
    }
}

// delete all sessions of a given questionnaire
async function postResetQ(req, res) {
    let statusCode = StatusCodes.OK;
    let response = {
        status: "OK",
        reason: undefined
    };

    const { vSuccess, vError } = await verifyQuestionnaireId();
    if (vError) {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        response.status = "failed";
        response.reason = "An error occured while querying the database";
    } else if (!vSuccess) {
        statusCode = StatusCodes.NOT_FOUND;
        response.status = "failed";
        response.reason = "No questionnaire exists with the given ID";
    } else {
        const { dSuccess } = await deleteQuestionnaireSessions();
        if (!dSuccess) {
            statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            response.status = "failed";
            response.reason = "An error occured while querying the database";
        }
    }

    res.status(statusCode).json(response);

    // helper functions --------------------

    async function verifyQuestionnaireId(questionnaireID) {
        try {
            const foundQuestionnaire = await Questionnaire.findOne().where("questionnaireID").equals(questionnaireID);
            return {
                success: foundQuestionnaire !== null,
                error: false
            };
        } catch (error) {
            console.error("An error occured while trying to find the given questionnaire:", error);
            return {
                success: false,
                error: true
            };
        }
    }

    async function deleteQuestionnaireSessions(questionnaireID) {
        try {
            const { deletedCount } = await Session.deleteMany(queryOptions).where("questionnaireID").equals(questionnaireID);
            console.log(`Deleted ${deletedCount} sessions from the database`);
            return { success: true };
        } catch (error) {
            console.error("An error occured while trying to delete the requested sessions:", error);
            return { success: false };
        }
    }
}

export { getHealthcheck, postQuestionnaireUpd, postResetAll, postResetQ };
