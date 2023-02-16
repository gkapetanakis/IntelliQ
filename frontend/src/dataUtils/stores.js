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
// seenQuestions is an array of objects of the following form:
// {
//  qID,        : the questionID of the answered question
//  qtext,      : the question text of the answered question
//  options,    : the array of options of the answered question
//  ans         : the option text of the users answer to the question
//}
// fields qID, qtext, options are used for { original, replacement } pairing
// when the question has a reference to an older and already answered question
// qtext and ans are used to display to the user their submitted answers

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
    const variable = writable(
        JSON.parse(sessionStorage.getItem(variableName)) || initialValue
    ); // create
    
    variable.subscribe((val) => 
        sessionStorage.setItem(variableName, JSON.stringify(val))
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