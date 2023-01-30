<script>

    import SearchForm from "./lib/SearchForm.svelte";
    import AnswerQuestionForm from "./lib/AnswerQuestionForm.svelte";
    import { findNextQuestion } from "./lib/functions/submitAnswer";

    let questionnaireInfo;
    let questionsArray;
    let session = null;
    let currentScreen = "searchForm";

    async function foundQuestionnaire(event) {
        console.log(event.detail);
        questionnaireInfo = event.detail.questionnaireInfo;
        questionsArray = event.detail.questionsArray;

        currentScreen = "answerQuestionForm";
    }

    function answeredQuestion(event) {
        console.log(event.detail);
        questionnaireInfo.nextQuestionID = event.detail.nextQuestionID;
        session = event.detail.session;
    }

</script>

<main>
    {#if currentScreen === "searchForm"}
        <div class="searchFrom">
            <SearchForm on:foundQuestionnaire={foundQuestionnaire}/>
        </div>
    {:else if currentScreen === "answerQuestionForm"}
        <div class="answerQuestionForm">
            {#await findNextQuestion(questionnaireInfo)}
                <p>Loading...</p>
            {:then nextQuestion}
                <AnswerQuestionForm
                {questionnaireInfo}
                {questionsArray}
                {nextQuestion}
                {session}
                on:answeredQuestion={answeredQuestion}/>
            {/await}
        </div>
    {/if}
</main>