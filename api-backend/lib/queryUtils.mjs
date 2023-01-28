async function findQueryHelper(query) {
    // UNFINISHED
    try {
        const { doc, err } = await query;
    } catch (err) {
        handleErrors(err);
    }
}

async function deleteQueryHelper(query) {
    // UNFINISHED
    try {
        const { cnt } = await query;
    } catch (err) {
        handleErrors(err);
    }
}

export { findQueryHelper, deleteQueryHelper };
