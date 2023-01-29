import { StatusCodes } from "http-status-codes";

// two types of errors are possible:
//     validation error:
//         attempted to create a document with invalid values in its fields -> BAD REQUEST
//     internal error:
//         failed to connect to the database -> INTERNAL SERVER ERROR

function handleErrors(err) {
    return err.name === "ValidationError" ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;
}

export { handleErrors };
