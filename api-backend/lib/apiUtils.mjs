// import third party modules
import { StatusCodes } from "http-status-codes";

// import this package's modules
import { removePrivateFields } from "./jsonUtils.mjs";

// handles the response of a query
// res is:
//     the document(s) found in a "find" query
//     the number of documents deleted in a "delete" query
//     null if an error occured while executing the query
// err is:
//     null if no error occured
//     the error that occured if an error occured
// transform is:
//     the function to be applied to "res" in order to transform 
//     it to the object that the API will send to the user (if needed)
//     null if not needed
// the function returns { status, response } which is what will be sent to the user
// if err is not null the response will contain info about the error that occured
function handleQueryResponse(res, err, transform) {
    let status = undefined;
    let response = undefined;

    if (err) { // some error occured
        status = StatusCodes.INTERNAL_SERVER_ERROR;
        response = { err }; // TODO: change
        console.debug("Handled response of failed query");
    } else if (doc instanceof Number) { // query was a delete
        status = StatusCodes.NO_CONTENT;
        console.debug("Handled response of 'delete' query");
    } else if (!doc || doc.length === 0) { // query was a find but no document was found
        status = StatusCodes.NOT_FOUND;
        console.debug("Handled response of 'find' query with no content");
    } else { // query was a find and document(s) were found
        status = StatusCodes.OK;
        removePrivateFields(res);
        response = transform(res);
        console.debug("Handled response with 'find' query with content");
    }
    return { status, response };
}

export { handleQueryResponse };
