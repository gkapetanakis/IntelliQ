import { StatusCodes } from "http-status-codes";

// Could have used Parser, which is synchronous, but whatever...
import { AsyncParser } from "@json2csv/node";

// check query parameters
// accept requests with either no query parameters or
// only 1 "format" parameter
function checkParams(req, res, next) {
    const formatValues = [undefined, "json", "csv"];
    const query = req.query;

    // if we don't care about other query parameters remove this segment
    // ------------------------- start segment -------------------------
    const keys = Object.keys(query);
    if (keys.length > 1 || keys[0] !== "format") {
        // reject request
        res.status(StatusCodes.BAD_REQUEST).json();
        return;
    }
    // -------------------------- end segment --------------------------

    const format = query?.format;
    if (formatValues.includes(format)) {
        // accept request
        next();
    }
    else {
        // reject request
        res.status(StatusCodes.BAD_REQUEST).json();
    }
}

// format based on the value of "format" query parameter
async function format(req, res) {
    const format = req.query?.format;
    // res.locals.data might not have a "response"
    let { status, response } = res.locals?.data;

    if (!format || format === "json") {
        res.status(status).json(response);
    }
    else if (format === "csv") {
        if (!!response) {
            try {
                const parser = new AsyncParser();
                response = await parser.parse(response).promise();
            }
            catch (err) {
                status = StatusCodes.INTERNAL_SERVER_ERROR;
                response = undefined;
            }
        }
        res.set("Content-Type", "text/csv");
        res.status(status).send(response);
    }
    else {
        // this case will execute only if we've written checkParams wrong
        res.status(StatusCodes.BAD_REQUEST).json();
    }
}

export { checkParams, format };