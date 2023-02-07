// in every function:
//     res: the result of the query
//     err: the error that occured
//     next: calls the next middleware

function successfulSaveHook(docType) {
    return function(res) {
        const many = Array.isArray(res) && res.length !== 1; // true if many documents were saved
        const count = many ? res.length : (1 * (res != null)); // how many objects were saved
        console.debug(`${docType}:\
        \n    'save' operation completed successfully\
        \n    ${count} document${count !== 1 ? "s were" : " was"} created`
        );
    };
}

function failedSaveHook(docType) {
    return function(_err, _res, next) {
        console.error(`${docType}:\
        \n    error during 'save' operation`
        );
        next();
    };
}

function successfulFindHook(docType) {
    return function(res) {
        const many = Array.isArray(res) && res.length !== 1; // true if many documents were found
        const count = many ? res.length : (1 * (res != null)); // how many objects were found
        console.debug(`${docType}:\
        \n    'find' operation completed successfully\
        \n    ${count} document${count !== 1 ? "s were" : " was"} found`
        );
    };
}

function failedFindHook(docType) {
    return function(_err, _res, next) {
        console.error(`${docType}:\
        \n    error during 'find' operation`
        );
        next();
    };
}

function successfulDeleteHook(docType) {
    return function(res) {
        const count = res.deletedCount; // how many objects were saved
        console.debug(`${docType}:\
        \n    'delete' operation completed successfully\
        \n    ${count} document${count !== 1 ? "s were" : " was"} deleted`
        );
    };
}

function failedDeleteHook(docType) {
    return function(_err, _res, next) {
        console.error(`${docType}:\
        \n    error during 'delete' operation`
        );
        next();
    };
}

export { 
    successfulSaveHook,
    failedSaveHook,
    successfulFindHook,
    failedFindHook,
    successfulDeleteHook,
    failedDeleteHook 
};
