<script>
    import SearchForm from "./forms/SearchForm.svelte";
    import AnswerQuestionForm from "./forms/AnswerQuestionForm.svelte";
    import ErrorCard from "./forms/ErrorCard.svelte";
    import Card from "./forms/Card.svelte";
    import { getReasonPhrase } from "http-status-codes";

    import { searchNextQuestion } from "./lib/search";
    import {
        questionnaireInfo,
        questionsArray,
        session,
        currentScreen,
        clearStorage,
        fetchInfo
        } from "./stores/dataStores";

    async function foundQuestionnaire(event) {
        console.log(event.detail);
        $questionnaireInfo = event.detail.questionnaireInfo;
        $questionsArray = event.detail.questionsArray;

        $currentScreen = "answerQuestionForm";
    }

    function answeredQuestion(event) {
        console.log(event.detail);
        $questionnaireInfo.nextQuestionID = event.detail.nextQuestionID;
        $session = event.detail.session;
    }
</script>

<main>
    {#if $fetchInfo.status < 300}
        {#if $currentScreen === "searchForm"}
            <div class="searchFrom">
                <SearchForm on:foundQuestionnaire={foundQuestionnaire}/>
            </div>
        {:else if $currentScreen === "answerQuestionForm"}
            <div class="answerQuestionForm">
                {#await searchNextQuestion($questionnaireInfo)}
                    <p>Loading...</p>
                {:then {finished, nextQuestion}}
                    {#if !finished}
                        <AnswerQuestionForm
                        questionnaireInfo={$questionnaireInfo}
                        questionsArray={$questionsArray}
                        nextQuestion={nextQuestion}
                        session={$session}
                        on:answeredQuestion={answeredQuestion}/>
                    {:else}
                        <Card>
                            <form>
                                <p>Congratulations! You finished answering a questionnaire!</p>
                                <button type="submit" on:click={clearStorage}>Reset</button> 
                            </form>
                        </Card>
                    {/if}
                {/await}
            </div>
        {/if}
    {:else}
        <ErrorCard>
            <form>
                <p>{(!!$fetchInfo.content)?JSON.stringify($fetchInfo.content):"" + " - " + getReasonPhrase($fetchInfo.status)}</p>
                <button type="submit" on:click={clearStorage}>Reset</button>
            </form>
        </ErrorCard>
    {/if}
</main>