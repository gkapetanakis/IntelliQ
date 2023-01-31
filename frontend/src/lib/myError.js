import { getReasonPhrase } from "http-status-codes";

class MyError extends Error {
    constructor({message, name = null, statusCode = null}) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        if (statusCode) this.name = getReasonPhrase(statusCode);
    }

    toString() {
        let outputString = this.name;

        if (!!this.message) outputString += `: ${this.message}`;
        if (!!this.statusCode) outputString += ` (Status Code: ${this.statusCode})`;
        return outputString;
    }
}

export { MyError };