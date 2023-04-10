<script>
    import ScrollyHelper from "$components/helpers/Scrolly.svelte";
    import ButtonSet from "./helpers/ButtonSet.svelte";
    import DemoButtonSet from "$components/demo/Demo.ButtonSet.svelte";
    import { fade } from 'svelte/transition';

    export let copySteps;


    let videoEl;
    let currentTime = 0;
    let sticky;
    let scrollValue;
	let duration;
    let binded;

	$: widthElapsed = toPercent(progress, duration);
	$: progress = currentTime || 0;

    $: scrollOverride = scrollValue || 0;

    $: options = scrollOverride > -1 ? copySteps[scrollOverride]["options"].split(",").map(d => {
        return {"value": d};
    }) : [];

    const toPercent = (a, b = 1) => `${(a / b) * 100}%`;

</script>

<div
    class="sticky"
    bind:this={sticky}
>
    <div class="montage video-wrapper">
        <div class="chooser">
            <div class="options">
                <!-- <DemoButtonSet {options}/> -->
                {#key options}
                    <ButtonSet legend={"View Dark Pattern for"} {options} bind:binded />
                {/key}
                <!-- <Toggle options={options} label="Enable" style="inner" bind:value={binded} /> -->

                <!-- {#each options as option, i}
                    <p 
                        class="{i == 0 ? 'active' : ''}">{option}
                    </p>
                {/each} -->
            </div>
        </div>
        {#if binded}
            <video muted autoplay loop src="assets/{binded.toLowerCase().replace(" ","_").replace(" ","_")}.mp4" bind:this={videoEl} bind:currentTime bind:duration>
            </video>
        {/if}
        <div class="progress">
			<span style:width={widthElapsed} class="elapsed" />
			<span class="cut">
            </span>
		</div>
    </div>

</div>

<ScrollyHelper bind:value={scrollValue}>
    {#each copySteps as step, i}
        {@const active = scrollValue === i}
            <div
                class="step"
                class:active
            >
                {#if step["type"] == "darkStep"}
                    <p class="dark-hed">{@html step.hed}</p>
                    {#each step.text as sectionBlockText}
                        <p class="running-text">{@html sectionBlockText.value}</p>
                    {/each}
                {/if}
            </div>
    {/each}
</ScrollyHelper>

<style>

    .chooser {
        margin: 0 auto;
        max-width: 450px;
        width: 100%;
    }

    .choose-title {
        margin: 0 auto;        
    }

    .options {
        display: flex;
        margin-bottom: 25px;
    }

    .options p {
        margin: 0;
        font-family: 'CozetteVector';
        color: rgba(0,0,0,.5);
        font-size: 18px;
        margin-right: 1rem;
        cursor: pointer;
    }


    h2 {
        margin-bottom: 100px;
    }
    .sticky {
		position: sticky;
		top: 0;
        left: auto;
        right: 0;
        z-index: 0;
		height: 100vh;
        margin: 0;
        margin-left: auto;
		width: 50%;
		overflow: hidden;
	}

    .montage {
        width: 100%;
        max-width: 1200px;
        height: 100%;
        max-height: calc(100% - 50px);
        margin: 0 auto;
    }

    .video-wrapper {
        max-width: none;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .video-wrapper video {
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
    }

    .video-wrapper .progress {
        height: 10px;
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
        background:#C4C4C5;
    }

    .progress .elapsed{
        background: #FFE600;
        height: 100%;
        position: relative;
        display: block;
    }

    .step {
        min-height: 100vh;
        max-width: 50%;
        z-index: 100;
    }



    .running-text, .dark-hed{
        color: black;
        max-width: 400px;
        padding: 1rem;
        font-family: 'Lyon';
        font-size: 18px;
        margin: 0 auto;
    }

    .dark-hed {
        font-size: 24px;
        font-family: 'CozetteVector';
    }

    p.active {
        color: black;
        text-decoration: underline;
        text-decoration-color: rgba(0,0,0,.3);
    }
</style>