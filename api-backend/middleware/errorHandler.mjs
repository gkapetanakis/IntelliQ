import { StatusCodes, ReasonPhrases } from "http-status-codes";

function errorHandler(err, req, res, next) {
    const error = { message: "An error occured" };
    if (res.statusCode === StatusCodes.BAD_REQUEST)
        error.message = ReasonPhrases.BAD_REQUEST;
    else if (res.statusCode === StatusCodes.NOT_FOUND)
        error.message = ReasonPhrases.NOT_FOUND;
    else if (res.statusCode === StatusCodes.INTERNAL_SERVER_ERROR)
        error.message = ReasonPhrases.INTERNAL_SERVER_ERROR;
    else
        console.error("Unknown error status code encountered:", res.statusCode);
    res.json(error);
}

export default errorHandler;
