// executes the given query and returns a pair { res, err }
// res is the query response and it is:
//      the document(s) found in a "find" query
//      the number of documents deleted in a "delete" query
//      null if an error occured
// err is:
//      null if no error occured
//      the error that occured if an error occured
// this function basically just wraps a try/catch block that would otherwise be repeated everywhere
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

export { executeQuery };
