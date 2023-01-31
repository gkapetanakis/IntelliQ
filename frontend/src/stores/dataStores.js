import { writable } from "svelte/store";

const noNextQuestionID = "-";

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
const chosenOpt = createAndSubscribe("chosenOpt", null);
const errorInfo = createAndSubscribe("errorInfo","");

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

    const variable =
        writable(
            JSON.parse(localStorage.getItem(variableName)) ||
            initialValue);

    variable.subscribe(
        (val) => localStorage.setItem(
                    variableName,
                    JSON.stringify(val)));

    return variable;
}