
<script>
    import { base } from "$app/paths";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import { fade } from "svelte/transition";
    import SpriteDark from "$components/SpriteDark.svelte";
    import SpriteWrapper from "$components/SpriteWrapper.svelte";
    import vimeo_1 from "$svg/vimeo_1_1.svg"

    import FinderWindow from "$components/FinderWindow.svelte"
	import inView from "$actions/inView.js";
    import { groups, format } from "d3";

    export let copySteps;
    export let cueData;
    export let sesameSprites;
    export let copy;

    let currentTime = 0;
    let duration;
    let sticky;
    let test;
    let scrollValue;
    let sprites;
    let floatBottom = true;
    
	$: widthElapsed = toPercent(progress, duration);
	$: progress = currentTime || 0;
    $: copyId = scrollValue ? scrollValue : 0;
    $: id = copySteps[copyId].id;
    $: bubbleText = copySteps[copyId]["text"];
    $: cues = cueData.filter((d) => d.id === id && d.sprite);
    $: sprites = groups(cues, (d) => {
        return d.key
    });

    const toPercent = (a, b = 1) => `${(a / b) * 100}%`;


</script>

<div
    class="sticky"
    bind:this={sticky}
    use:inView={{ progress: true }}
    on:enter={() => (test = true)}
    on:exit={() => (test = false)}
    >
    <div class="dark-fade">

    </div>
    <SpriteWrapper BASE={96} hideBubble={true} floatBottom={floatBottom} bubbleText={""} id={id} sprites={sprites} cueData={cueData} sesameSprites={sesameSprites} />

</div>

<Scrolly bind:value={scrollValue}>
    {#each copySteps as step, i}
        {@const stepId = id === "intro" && i === 0 ? "scroll-to-start" : null}
        {@const active = scrollValue === i}

        <div
            id={step.id}
            class="step {stepId}"
            class:active
        >
            {#each step.body as bodyText, n}
                <p class="running-text  {i} {n}">{@html bodyText.value}</p>
                {#if i == 0 && n == 1}
                    <div class="vimeo-image-wrapper">
                        <img src="assets/vimeo_1.png" alt="">
                        <div class="svg">
                            {@html vimeo_1}
                        </div>
                    </div>
                {/if}
                {#if i == 2 && n == 2}
                    <div class="vimeo-free-wrapper">
                        Where Vimeo hides its free version
                        <video muted autoplay loop src="assets/vimeo_free.mp4" bind:currentTime bind:duration alt=""></video>
                        <div class="progress">
                            <span style:width={widthElapsed} class="elapsed" />
                            <span class="cut">
                            </span>
                        </div>
                    </div>
                {/if}

            {/each}
        </div>
    {/each}
</Scrolly>

<style>

    .sticky {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		position: sticky;
		top: 0;
        z-index: 10000;
		height: 100vh;
		width: 100%;
		overflow: hidden;
        pointer-events: none;
	}

    .sprite-sandbox {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .sprite-container {
        width: 100%;
        height: 100%;
        max-height: 500px;
        position: absolute;
        top: 50%;
        transform: translate(0,-50%);
    }

    .step {
        margin: 0 auto;
    }

    .step p {
        color: white;
        font-size: 18px;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 1.5;
        margin-bottom: 24px;

    }

    .step:first-of-type {
		margin-top: -50vh;
        min-height: 50vh;
	}

    .dark-fade {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 70%, #151517 100%);
        height: 100%;
        width: 100%;
        position: absolute;
        opacity: 0;
    }

    .vimeo-image-wrapper {
        position: relative;
        margin: 50px auto;
        max-width: 500px;

    }

    .vimeo-image-wrapper .svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .running-text {
        max-width: 600px;
        margin: 0 auto;
    }

    .vimeo-free-wrapper {
        position: relative;
        margin: 50px auto;
        max-width: 600px;
        color: white;
        font-family: 'CozetteVector';
        text-align: center;
        font-size: 18px;
        padding-bottom: 600px;
    }

    .vimeo-free-wrapper video {
        margin-top: 25px;
    }

    .progress {
        height: 10px;
        width: 100%;
        margin: 0 auto;
        background:#C4C4C5;
    }

    .progress .elapsed{
        background: #FFE600;
        height: 100%;
        position: relative;
        display: block;
    }
</style>
