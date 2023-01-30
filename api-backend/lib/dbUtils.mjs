// executes the given query and returns a pair { res, err }
// res is:
//     the query response:
//         the document(s) found in a 'find' query (can be null if none were found)
//         an object that contains the number of documents deleted in a 'delete' query (deletedCount field)
//     null if an error occured
// err is:
//     null if no error occured
//     the error that occured if an error occured
// this function basically just wraps a try/catch block that would
// otherwise be repeated at every place a query is executed
async function executeQuery(query) {
    let res = null, err = null;
    try {
        res = await query;
    } catch (error) {
        err = error;
    }
    return { res, err };
}

// creates and saves a document of the given model using the json provided and returns { doc, err }
// doc is:
//     the document created
//     null if an error occured
// err is:
//     null if no error occured
//     the error that occured if an error occured
// this function basically wraps a try/catch block that would
// otherwise be repeated at every place a document is created
async function createDocument(json, model) {
    let err = null;
    try {
        await model.create(json);
    } catch (error) {
        err = error;
    }
    return { err };
}

export { executeQuery, createDocument };
