import { StatusCodes } from "http-status-codes";

// Could have used Parser, which is synchronous, but whatever...
import { AsyncParser } from "@json2csv/node";

// check query parameters
// accept requests with either no query parameters or
// only 1 "format" parameter
function checkParams(req, res, next) {
    const query = req.query;
    const keys = Object.keys(query);
    if (keys.length === 0 ||
       (keys.length === 1 &&
        keys[0] === "format")) {
        next(); // accept request and continue proccessing
      } else {
        res.status(StatusCodes.BAD_REQUEST).json();
        // reject request
      }
}

// format based on the value of "format" query parameter
async function format(req, res) {
    const format = req.query?.format;
    let { status, response } = res.locals.data;

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
        res.status(StatusCodes.BAD_REQUEST).json();
    }
}

export { checkParams, format };