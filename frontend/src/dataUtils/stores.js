import { writable } from "svelte/store";

const questionnaireInfo = createAndSubscribe("questionnaireInfo", {
    questionnaireID: null,
    questionnaireTitle: null,
    nextQuestionID: null
});
const questionsArray = createAndSubscribe("questionsArray", []);
const session = createAndSubscribe("session", null);
const currentScreen = createAndSubscribe("currentScreen", "searchForm");
const seenQuestions = createAndSubscribe("seenQuestions", []);
const errorInfo = createAndSubscribe("errorInfo", {
    message: null,
    name: null,
    statusCode: null
}); // used by the app to manage occuring errors

function clearStorage() {
    sessionStorage.clear();
    location.reload();
}

//----------------------------- helper function---------------------------------

// These variables will exist in the session storage of our browser. Will persist
// refresh but not close and open. Helps us keep our page fresh and organized for
// the user.
function createAndSubscribe(variableName, initialValue) {
    const variable = writable(JSON.parse(sessionStorage.getItem(variableName)) ||
                              initialValue); // create
    
    variable.subscribe((val) => sessionStorage.setItem(
                                                        variableName,
                                                        JSON.stringify(val))
                                                        ); // subscribe
    return variable;
}

export {
    questionnaireInfo,
    questionsArray,
    session,
    currentScreen,
    seenQuestions,
    errorInfo,
    clearStorage
};