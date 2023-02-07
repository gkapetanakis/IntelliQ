<script>
    import SearchForm from "./forms/SearchForm.svelte";
    import AnswerQuestionForm from "./forms/AnswerQuestionForm.svelte";
    import ErrorCard from "./forms/ErrorCard.svelte";
    import Card from "./forms/Card.svelte";

    // after answering a question we look for the next
    import { searchNextQuestion } from "./lib/search";

    // stores and useful data to manage the state of our app
    import {
        questionnaireInfo,
        questionsArray,
        session,
        currentScreen,
        clearStorage,
        errorInfo
        } from "./stores/dataStores";

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
        $session = event.detail.session;
    }
    /* -------------------------------------------------------------------*/
    
    function handleErrorOccured() {
        $currentScreen = "errorScreen";
    }

</script>

<!-- We create our Screens/Forms and install handlers for possible events.
     The await keyword is quite usefull, allows for the peaceful resolution
     of the promise for data -->
<main>
{#if $currentScreen === "searchForm"}
    <SearchForm
        on:foundQuestionnaire={foundQuestionnaire}
        on:errorOccured={handleErrorOccured}/>
{:else if $currentScreen === "answerQuestionForm"}
    {#await searchNextQuestion($questionnaireInfo)}
    <Card>Loading...</Card>
    {:then nextQuestion}
    <AnswerQuestionForm
        questionnaireInfo={$questionnaireInfo}
        questionsArray={$questionsArray}
        nextQuestion={nextQuestion}
        session={$session}
        on:answeredQuestion={answeredQuestion}
        on:errorOccured={handleErrorOccured}/>
    {:catch err}
        {handleErrorOccured()}
    {/await}
{:else if $currentScreen === "finishedScreen"}
<div class="finish-card">
    <Card>
        <form on:submit|preventDefault={clearStorage}> 
            <p>Congratulations! You finished answering a questionnaire!</p>
            <button type="submit">Reset</button> 
        </form>
    </Card>
</div>
{:else}
<div class="error-card">
    <ErrorCard>
        <form on:submit|preventDefault={clearStorage}>
            <p>{$errorInfo}</p>
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