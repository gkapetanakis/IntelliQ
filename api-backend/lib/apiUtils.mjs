// import third party modules
import { StatusCodes } from "http-status-codes";

// import this package's modules
import { executeQuery } from "./dbUtils.mjs";
import { handleError } from "./errorUtils.mjs";
import { removePrivateFields } from "./jsonUtils.mjs";

// handles the output of the executeQuery() function
// transform:
//     a function that will be applied to res before it is returned
//     if transform is null or undefined, res is returned as it is
// the function returns { status, response }, which are meant to be sent back to an endpoint's caller
function handleQueryResponse({ res, err }, transform) {
    let status = undefined, response = undefined;
    if (err) { // some error occured
        const errorResponse = handleError(err);
        status = errorResponse.status;
    } else if (!res || res.length === 0) { // query was a find but no document was found
        status = StatusCodes.NOT_FOUND;
    } else if (res.deletedCount !== undefined) { // query was a delete
        status = StatusCodes.NO_CONTENT;
    } else { // query was a find and document(s) were found
        status = StatusCodes.OK;
        removePrivateFields(res);
        response = transform instanceof Function ? transform(res) : res;
    }
    return { status, response };
}

// handles the output of the createDocument() function
// the function returns status, which is meant to be sent back to an endpoint's caller
function handleCreateResponse({ err }) {
    let status = undefined;

    if (err) { // some error occured
        const errorResponse = handleError(err);
        status = errorResponse.status;
    } else { // save successful
        status = StatusCodes.NO_CONTENT;
    }
    return status;
}

// performs the given query and returns { ans, err } where ans is a bool indicating
// whether one or more documents were returned from the query and err is null if the query
// was successful, or the error that caused the query to fail
async function documentExists(query) {
    const { res, err } = await executeQuery(query);
    const ans = (res != null) && (!Array.isArray(res) || res.length > 0);
    return { ans, err };
}

export {
    handleQueryResponse,
    handleCreateResponse,
    documentExists
};
