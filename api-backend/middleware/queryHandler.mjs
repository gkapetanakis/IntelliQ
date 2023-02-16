import mongoose, { mongo } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { removePrivateFields } from "../lib/jsonUtils.mjs";

// uses res.locals.query, res.locals.transform
async function findQueryHandler(_req, res, next) {
    console.log(`${res.locals.step++}. Query handler (find) executing`);

    try {
        // if database is offline throw error
        if (mongoose.connection.readyState !== 1)
            throw new Error("internal server error");

        // execute the query
        const doc = await res.locals.query;

        // if not found throw error
        if (!doc || doc?.length === 0) {
            res.status(StatusCodes.NOT_FOUND);
            next(new Error("Document not found"));
        } else {
            // remove private fields and transform with given function
            removePrivateFields(doc);
            res.status(StatusCodes.OK);
            res.locals.responseObj = res.locals?.transform
                ? res.locals.transform(doc)
                : doc;
            next();
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        next(err);
    }
}

// uses res.locals.model, res.locals.obj
async function createQueryHandler(_req, res, next) {
    console.log(`${res.locals.step++}. Query handler (create) executing`);

    try {
        // if database is offline throw error
        if (mongoose.connection.readyState !== 1)
            throw new Error("internal server error");

        // execute query
        await res.locals.model.create(res.locals.obj);
        res.status(StatusCodes.NO_CONTENT);
        next();
    } catch (err) {
        res.status(mongoose.connection.readyState !== 1 
            ? StatusCodes.INTERNAL_SERVER_ERROR
            : StatusCodes.BAD_REQUEST
        );
        next(err);
    }
}

export { findQueryHandler, createQueryHandler };
