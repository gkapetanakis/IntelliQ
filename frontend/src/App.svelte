<script>
    import Card from "./components/Card.svelte";
    import ErrorCard from "./components/ErrorCard.svelte";
    import SearchForm from "./components/SearchForm.svelte";
    import AnswerQuestionForm from "./components/AnswerQuestionForm.svelte";
    import { searchNextQuestion } from "./functionUtils/search";
    import { noNextQuestionID } from "./dataUtils/constantValues";
    import {
        questionnaireInfo,
        questionsArray,
        session,
        currentScreen,
        seenQuestions,
        errorInfo,
        clearStorage
    } from "./dataUtils/stores";

    let errorInfoToString; // used in the App to display the Error
    errorInfo.subscribe(({message, name, statusCode}) => {
        let outputString = name;
        if (!!message) outputString += `: ${message}`;
        if (!!statusCode) outputString += ` (Status Code: ${statusCode})`;
        errorInfoToString = outputString;
    });

    errorInfo.subscribe(({message, name, statusCode}) => {
        if (!!message || !!name || !!statusCode)
            $currentScreen = "errorScreen";
    }); // in case an error occurs

    /* -------------------------------------------------------------------*/
    //In Svelte, when we use events that carry data,
    //that data is in the event.detail field

    function foundQuestionnaire(event) {
        $questionnaireInfo = event.detail.questionnaireInfo;
        $questionsArray = event.detail.questionsArray;
        $currentScreen = "answerQuestionForm";
    }

    function answeredQuestion(event) {
        $questionnaireInfo.nextQuestionID = event.detail.nextQuestionID;
        if ($questionnaireInfo.nextQuestionID === noNextQuestionID) {
            $currentScreen = "finishedScreen"; // user reached the end!
        }
        $session = event.detail.session;
    }
    /* -------------------------------------------------------------------*/
</script>

<main>
{#if $currentScreen === "searchForm"}
    <SearchForm
        on:foundQuestionnaire={foundQuestionnaire}/>
{:else if $currentScreen === "answerQuestionForm"}
    {#await searchNextQuestion($questionnaireInfo)}
    <Card>Loading...</Card>
    {:then nextQuestion}
    <AnswerQuestionForm
        questionnaireInfo={$questionnaireInfo}
        questionsArray={$questionsArray}
        nextQuestion={nextQuestion}
        session={$session}
        on:answeredQuestion={answeredQuestion}/>
    {/await} <!-- errors are caught in errorInfo subscriber -->
{:else if $currentScreen === "finishedScreen"}
    <div class="finish-card">
        <button form="finish-card-form" type="submit">Reset</button> 
        <Card>
            <form id="finish-card-form" on:submit|preventDefault={clearStorage}>
                <p>Congratulations! You finished answering a questionnaire!</p>
                <p>Here are your answers for "{$questionnaireInfo.questionnaireTitle}":</p>
            </form>
        </Card>
        {#each $seenQuestions as question}
        <Card>
            <p>Question: {question.qtext}</p>
            {#if question.ans !== ""}
            <p>Your answer: {question.ans}</p>
            {:else}
            <p>This question was skipped.</p>
            {/if}
        </Card>
        {/each}
        <button form="finish-card-form" type="submit">Reset</button> 
    </div>
{:else}
    <div class="error-card">
        <ErrorCard>
            <form on:submit|preventDefault={clearStorage}>
                <p>{errorInfoToString}</p>
                <button type="submit" >Reset</button>
            </form>
        </ErrorCard>
    </div>
{/if}
</main>

<style>
    .finish-card {
        text-align: center;
        padding: 2em;
    }

    .finish-card form {
        margin-top: 2em;
        display: inline-block;
    }

    .finish-card p {
        font-size: 1.2em;
        color: #4d4d4d;
        margin-bottom: 1em;
    }

    .finish-card button {
        padding: 0.5em 1em;
        background-color: #737373;
        color: #fff;
        border: none;
        border-radius: 0.2em;
        font-size: 1em;
        cursor: pointer;
    }

    .error-card form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1rem;
    }

    .error-card p {
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .error-card button {
        background-color: #721c24;
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 0.75rem 1.5rem;
        font-weight: bold;
        cursor: pointer;
    }
</style>