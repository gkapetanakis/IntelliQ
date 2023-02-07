import { writable } from "svelte/store";

const noNextQuestionID = "-"; // if a question has this string as a nextqID, then
                              // this is where the questionnaire ends

const baseUrl = ""
+ `http://${import.meta.env.VITE_APP_HOST}`
+ `:${import.meta.env.VITE_APP_PORT}`
+ `${import.meta.env.VITE_APP_BASE_URL}`;

// usefull data for our questionnaire answering, is kept when
// the page is refreshed
const questionnaireInfo = createAndSubscribe("questionnaireInfo",{
    questionnaireID: null,
    questionnaireTitle: null,
    nextQuestionID: null
});
const questionsArray = createAndSubscribe("questionsArray", []);
const session = createAndSubscribe("session", null);
const currentScreen = createAndSubscribe("currentScreen", "searchForm");
const chosenOpt = writable(null); // chosenOption, should NOT stay when refreshing
const errorInfo = createAndSubscribe("errorInfo",""); // a string which is the Error Message

function clearStorage() {
    sessionStorage.clear();
    location.reload();
    // since we reload we don't care about chosenOpt here
}

export {
    noNextQuestionID,
    baseUrl,
    questionnaireInfo,
    questionsArray,
    session,
    currentScreen,
    chosenOpt,
    errorInfo,
    clearStorage,
};

//-------------- helper function-------------------------------

function createAndSubscribe(variableName, initialValue) {
    // create the variable with some initial value
    const variable =
        writable(
            JSON.parse(sessionStorage.getItem(variableName)) ||
            initialValue);

    // save the variable locally
    variable.subscribe(
        (val) => sessionStorage.setItem(
                    variableName,
                    JSON.stringify(val)));

    return variable;
}