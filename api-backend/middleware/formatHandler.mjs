// asynchronous, non-blocking parser
import { AsyncParser } from "@json2csv/node";
import { StatusCodes } from "http-status-codes";

// change format from JSON to CSV if requested
// uses req.locals.responseObj
async function formatHandler(req, res) {
    console.log("Format handler executing");

    if (!res.locals?.responseObj) {
        res.send();
        return;
    }

    if (req.query?.format === "csv") {
        const responseObj = res.locals.responseObj;
        const parser = new AsyncParser();
        try {
            const responseCsv = await parser.parse(responseObj).promise();
            res.set("Content-Type", "text/csv");
            res.send(responseCsv);
            return;
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            next(err);
        }
    } //else {
        //res.set("Content-Type", "application/json");
    //}

    res.json(res.locals.responseObj);
}

export default formatHandler;
