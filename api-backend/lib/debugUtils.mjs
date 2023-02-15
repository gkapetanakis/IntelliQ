// in every function:
//     res: the result of the query
//     err: the error that occured
//     next: calls the next middleware

function successfulSaveHook(docType) {
    return function(res) {
        const many = Array.isArray(res) && res.length !== 1; // true if many documents were saved
        const count = many ? res.length : (1 * (res != null)); // how many objects were saved
        console.debug(`\t${docType}:\
        \n\t\t'save' operation completed successfully\
        \n\t\t${count} document${count !== 1 ? "s were" : " was"} created`
        );
    };
}

function failedSaveHook(docType) {
    return function(err, _res, next) {
        console.error(`\t${docType}:\
        \n\t\terror during 'save' operation:\n`, err
        );
        next();
    };
}

function successfulFindHook(docType) {
    return function(res) {
        const many = Array.isArray(res) && res.length !== 1; // true if many documents were found
        const count = many ? res.length : (1 * (res != null)); // how many objects were found
        console.debug(`\t${docType}:\
        \n\t\t'find' operation completed successfully\
        \n\t\t${count} document${count !== 1 ? "s were" : " was"} found`
        );
    };
}

function failedFindHook(docType) {
    return function(err, _res, next) {
        console.error(`\t${docType}:\
        \n\t\terror during 'find' operation:\n`, err
        );
        next();
    };
}

function successfulDeleteHook(docType) {
    return function(res) {
        const count = res.deletedCount; // how many objects were saved
        console.debug(`\t${docType}:\
        \n\t\t'delete' operation completed successfully\
        \n\t\t${count} document${count !== 1 ? "s were" : " was"} deleted`
        );
    };
}

function failedDeleteHook(docType) {
    return function(err, _res, next) {
        console.error(`\t${docType}:\
        \n\t\terror during 'delete' operation:\n`, err
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
