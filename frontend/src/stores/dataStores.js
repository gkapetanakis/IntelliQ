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
const chosenOpt = createAndSubscribe("chosenOpt", null); // chosenOption
const errorInfo = createAndSubscribe("errorInfo",""); // a string which is the Error Message

function clearStorage() {
    localStorage.removeItem("questionnaireInfo");
    localStorage.removeItem("questionsArray");
    localStorage.removeItem("session");
    localStorage.removeItem("currentScreen");
    localStorage.removeItem("chosenOpt");
    localStorage.removeItem("errorInfo");
    location.reload();
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
            JSON.parse(localStorage.getItem(variableName)) ||
            initialValue);

    // save the variable locally
    variable.subscribe(
        (val) => localStorage.setItem(
                    variableName,
                    JSON.stringify(val)));

    return variable;
}