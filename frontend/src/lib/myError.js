import { getReasonPhrase } from "http-status-codes";
import { errorInfo } from "../stores/dataStores";

class MyError extends Error {
    constructor({message, name = null, statusCode = null}) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        if (statusCode) this.name = getReasonPhrase(statusCode);

        errorInfo.set(this.toString()); // set error message
    }

    toString() { // override toString() method of Errors
        let outputString = this.name;

        if (!!this.message) outputString += `: ${this.message}`;
        if (!!this.statusCode) outputString += ` (Status Code: ${this.statusCode})`;
        return outputString;
    }
}

export { MyError };