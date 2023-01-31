// recursively remove all json fields that start with a "_"
function removePrivateFields(json) {
    // for each field in the given json
    Object.keys(json).forEach((key) => {
        // if it starts with a "_", delete it
        if (key[0] === "_") 
            delete json[key];
        // if it is an object and it did not get deleted, delete its private fields as well
        else if (json[key] instanceof Object) 
            removePrivateFields(json[key]);
    });
} 

export {
    removePrivateFields
};
