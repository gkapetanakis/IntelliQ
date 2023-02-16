// asynchronous, non-blocking parser
import { AsyncParser } from "@json2csv/node";
import { StatusCodes } from "http-status-codes";

// change format from JSON to CSV if requested
// uses req.locals.responseObj
async function formatHandler(req, res, next) {
    console.log(`${res.locals.step++}. Format handler executing`);

    // if response object exists and format is set to csv
    if (res.locals?.responseObj && req.query?.format === "csv") {
        const responseObj = res.locals.responseObj;
        const parser = new AsyncParser();
        try {
            // convert response object to csv
            req.locals.responseObj = await parser.parse(responseObj).promise();
            res.set("Content-Type", "text/csv");
            next();
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            next(err);
        }
    }
    else
        next();
}

export default formatHandler;
