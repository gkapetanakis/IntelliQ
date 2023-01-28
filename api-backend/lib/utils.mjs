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

function removePrivateFields(json) {
    // TODO
}

function handleErrors(err) {
    // TODO
}

export { findQueryHelper, deleteQueryHelper, removePrivateFields, handleErrors };
