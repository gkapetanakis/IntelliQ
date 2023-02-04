import { StatusCodes } from "http-status-codes";
import { removePrivateFields } from "../lib/jsonUtils.mjs";

// uses res.locals.query, res.locals.transform
async function findQueryHandler(req, res, next) {
    try {
        const doc = await res.locals.query;
        if (!doc || doc?.length === 0) {
            res.status(StatusCodes.NOT_FOUND);
        } else {
            removePrivateFields(doc);
            res.status(StatusCodes.OK);
            res.locals.responseObj = res.locals?.transform
                ? res.locals.transform(doc)
                : doc;
        }
        next();
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        next(err);
    }
}

// uses res.locals.model, res.locals.obj
async function createQueryHandler(req, res, next) {
    try {
        await res.locals.model.create(res.locals.obj);
        res.status(StatusCodes.NO_CONTENT);
        res.send();
        return;
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        next(err);
    }
}

export { findQueryHandler, createQueryHandler };
