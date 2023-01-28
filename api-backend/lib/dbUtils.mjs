// executes the given query and returns a pair { res, err }
// res is:
//     the query response and it is:
//         the document(s) found in a "find" query (can be null if none were found)
//         the number of documents deleted in a "delete" query
//     null if an error occured
// err is:
//     null if no error occured
//     the error that occured if an error occured
// this function basically just wraps a try/catch block that would
// otherwise be repeated at every place a query is executed
async function executeQuery(query) {
    let res = null;
    let err = null;
    try {
        res = await query;
        console.debug("A query completed successfully");
    } catch (error) {
        err = error;
        console.debug("An error occured while executing a query");
    }
    return { res, err };
}

// creates a document of the given model using the json provided and returns { doc, err }
// doc is:
//     the document created
//     null if an error occured
// err is:
//     null if no error occured
//     the error that occured if an error occured
// this function basically wraps a try/catch block that would
// otherwise be repeated at every place a document is created
function createDocument(json, model) {
    let doc = null;
    let err = null;
    try {
        doc = new model(json);
        console.debug("A document was successfully created");
    } catch (error) {
        err = error;
        console.debug("An error occured while creatig a document");
    }
    return { doc, err };
}

// saves the given document to the database and returns { err }
// err is:
//     null if no error occured
//     the error that occured if an error occured
// this function basically wraps a try/catch block that would
// otherwise be repeated at every place a document is saved
async function saveDocument(document) {
    let err = null;
    try {
        await document.save();
        console.debug("A document was saved successfully to the database");
    } catch (error) {
        err = error;
        console.debug("An error occured while saving a document to the database");
    }
    return { err };
}

export { executeQuery, createDocument, saveDocument };
