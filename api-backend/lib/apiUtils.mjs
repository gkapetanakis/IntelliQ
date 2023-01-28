// import third party modules
import { StatusCodes } from "http-status-codes";

// import this package's modules
import { saveDocument } from "./dbUtils.mjs";
import { removePrivateFields } from "./jsonUtils.mjs";

// handles the output of the executeQuery() function
// transform is:
//     the function to be applied to "res" in order to transform 
//     it to the object that the API will send to the user (if needed)
//     null if not needed
// the function returns { status, response } which is what will be sent to the user
// if err is not null the response will contain info about the error that occured
function handleQueryResponse({ res, err }, transform) {
    let status = undefined;
    let response = undefined;

    if (err) { // some error occured
        status = StatusCodes.INTERNAL_SERVER_ERROR;
        response = { err }; // TODO: error handling
        console.debug("Handled error that occured during query");
    } else if (res instanceof Number) { // query was a delete
        status = StatusCodes.NO_CONTENT;
        console.debug("Handled response of 'delete' query");
    } else if (!res || res.length === 0) { // query was a find but no document was found
        status = StatusCodes.NOT_FOUND;
        console.debug("Handled response of 'find' query with no content");
    } else { // query was a find and document(s) were found
        status = StatusCodes.OK;
        removePrivateFields(res);
        response = transform instanceof Function ? transform(res) : res;
        console.debug("Handled response with 'find' query with content");
    }
    return { status, response };
}

// handles the output of the createDocument() function and saves the document created
// the function returns { status, response } which is what will be sent to the user
// if err is not null the response will contain info about the error that occured
async function handleCreateResponseAndSave({ doc, err }) {
    let status = undefined;
    let response = undefined;

    if (err) { // some error occured
        status = StatusCodes.BAD_REQUEST;
        response = err; // TODO: error handling
        console.debug("Handled error that occured during document creation");
    } else { // creation successful
        const result = handleSaveResponse(await saveDocument(doc));
        status = result.status;
        response = result.response;
        console.debug("Handled response of successful document creation");
    }
    return { status, response };
}

// handles the output of the saveDocument() function
// the function returns { status, response } which is what will be sent to the user
// if err is not null the response will contain info about the error that occured
function handleSaveResponse({ err }) {
    let status = undefined;
    let response = undefined;

    if (err) { // some error occured
        status = StatusCodes.INTERNAL_SERVER_ERROR;
        response = err; // TODO: error handling
        console.debug("Handled error that occured during document save");
    } else { // save successful
        status = StatusCodes.NO_CONTENT;
        console.debug("Handled response of successful document save");
    }
    return { status, response };
}

export { handleQueryResponse, handleCreateResponseAndSave, handleSaveResponse };
