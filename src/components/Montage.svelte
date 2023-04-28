<script>
    import ScrollyHelper from "$components/helpers/Scrolly.svelte";

    export let copySteps;
    let sticky;
    let scrollValue;


</script>


<p class="big hed">The Results</p>

<div
    class="sticky"
    bind:this={sticky}
>
    <div class="montage {scrollValue == 0 ? 'visible' : ''}">
    </div>
</div>

<ScrollyHelper bind:value={scrollValue}>
    {#each copySteps as step, i}
        {@const active = scrollValue === i}
            <div
                class="step"
                class:active
            >
                {#if step["type"] == "body"}
                    {#each step.text as sectionBlockText}
                        <p class="running-text">{@html sectionBlockText.value}</p>
                    {/each}
                {/if}
            </div>
    {/each}
</ScrollyHelper>

<style>

    .hed {
        margin-bottom: 100px;
    }
    .sticky {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		position: sticky;
		top: 0;
        z-index: -1;
		height: 100vh;
		width: 100%;
		overflow: hidden;
	}

    .montage {
        background: url('assets/montage.png');
        width: 100%;
        max-width: 1200px;
        height: 100%;
        max-height: calc(100% - 50px);
        top: 25px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        background-size: cover;
        opacity: .5;
        transition: opacity 1s;
    }

    .visible {
        opacity: 1;
    }

    .step {
        min-height: 100vh;
        max-width: 100%;
        z-index: 100;
    }

    .running-text{
        max-width: 600px;
        background-color: #25304F;
        color: white;
        padding: 1rem;
        font-family: 'CozetteVector';
        font-size: 21px;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0 auto;
    }

    .step:first-of-type {
		margin-top: -50vh;
        min-height: 50vh;
	}
</style>