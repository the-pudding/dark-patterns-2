
<script>
    import { base } from "$app/paths";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import { fade } from "svelte/transition";
    import SpriteDark from "$components/SpriteDark.svelte";
    import SpriteWrapper from "$components/SpriteWrapper.svelte";
    import vimeo_1 from "$svg/vimeo_1_2.svg"
    import viewport from "$stores/viewport.js";
    import { onMount } from "svelte";

    import FinderWindow from "$components/FinderWindow.svelte"
	import inView from "$actions/inView.js";
    import { groups, scaleLinear } from "d3";


    export let copySteps;
    export let cueData;
    export let sesameSprites;
    export let copy;
    export let ariaVideoKey;
    export let blockId;

    let currentTime = 0;
    let currentTimeTwo = 0;

    let duration;
    let durationTwo;

    let sticky;
    let test;
    let scrollValue;
    let sprites;
    let floatBottom = true;
    let mounted = false;
    let explainerEl;

    let vimeoFreeEl;
    let vimeoExplainerEl;

    let loaded = false;

    let vimeo_free;
    let vimeo_explainer;
    
    let scaleBase = scaleLinear().domain([1500,400]).range([0,1]).clamp(true);
    

    $: widthElapsedTwo = toPercent(progressTwo, durationTwo);
    $: progressTwo = currentTimeTwo || 0;
	$: widthElapsed = toPercent(progress, duration);
	$: progress = currentTime || 0;
    $: copyId = scrollValue ? scrollValue : 0;
    $: id = copySteps[copyId].id;
    $: bubbleText = copySteps[copyId]["text"];
    $: cues = cueData.filter((d) => d.id === id && d.sprite);
    $: sprites = groups(cues, (d) => {
        return d.key
    });

    $: if(blockId == "vimeo"){
        if(!loaded){
            loadVideos();
        }
    }

    const toPercent = (a, b = 1) => `${(a / b) * 100}%`;

    function loadVideos(){
        loadVideo(vimeoFreeEl,"vimeo_free");
        loadVideo(vimeoExplainerEl,"vimeo_explainer");
        loaded = true;
    }

    async function loadVideo(videoEl,name){
        // clearTimeout(videoTimeout);
        videoEl.currentTime = 0;
        let src = `assets/${name}.mp4`;
        const request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.responseType = "blob";
        request.onload = function () {
            if (this.status === 200) {
                const videoBlob = this.response;
                const videoUrl = URL.createObjectURL(videoBlob);
                videoEl.src = videoUrl;
                videoEl.currentTime = 0;
                
                // videoTimeout = setTimeout(function() {
                //     videoEl.play();
                // }, 1000)
            }
        };
        request.send();
    }



    onMount(() => {
        vimeo_free = ariaVideoKey.get("Vimeo Free");
        vimeo_explainer = ariaVideoKey.get("Vimeo Explainer");
        mounted = true;
    });

</script>
{#if mounted}
<div
    class="sticky"
    bind:this={sticky}
    use:inView={{ progress: true }}
    on:enter={() => (test = true)}
    on:exit={() => (test = false)}
    >
    <div class="dark-fade">

    </div>
    <SpriteWrapper BASE={96-(32*scaleBase($viewport.width))} hideBubble={true} floatBottom={floatBottom} bubbleText={""} id={id} sprites={sprites} cueData={cueData} sesameSprites={sesameSprites} />

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
                        <img src="assets/vimeo_1.png" 
                            alt="Vimeo&rsquo;s pricing plans, which frame the payments as monthly, but are actually annual contracts. The month-to-month plans are obscured in the design behind a small drop-down menu."
                        >
                        <div class="svg">
                            {@html vimeo_1}
                        </div>
                    </div>
                {/if}
                {#if i == 1 && n == 0}
                    <div class="vimeo-explain-wrapper">
                        Vimeo&rsquo;s Dark Patterns when Canceling
                        <video 
                            muted loop
                            autoplay
                            playsinline
                            webkit-playsinline="webkit-playsinline"
                            src="assets/vimeo_explainer.mp4"
                            bind:this={vimeoExplainerEl}
                            bind:currentTime={currentTimeTwo} bind:duration={durationTwo}
                            aria-label="{vimeo_explainer}"
                        >
                        </video>
                        <div class="progress">
                            <span style:width={widthElapsedTwo} class="elapsed" />
                            <span class="cut">
                            </span>
                        </div>
                    </div>
                {/if}

                {#if i == 2 && n == 2}
                    <div class="vimeo-free-wrapper">
                        Where Vimeo hides its free version
                        <video muted loop
                            playsinline
                            autoplay
                            bind:this={vimeoFreeEl}
                            webkit-playsinline="webkit-playsinline"
                            src="assets/vimeo_free.mp4" bind:currentTime bind:duration
                            aria-label="{vimeo_free}"
                        ></video>
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
{/if}
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
        width: calc(100% - 20px);

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
        width: calc(100% - 20px);
    }

    .vimeo-free-wrapper, .vimeo-explain-wrapper {
        position: relative;
        margin: 50px auto;
        max-width: 450px;
        color: white;
        font-family: 'CozetteVector';
        text-align: center;
        font-size: 18px;
        padding-bottom: 600px;
        width: calc(100% - 20px);
    }

    .vimeo-explain-wrapper {
        padding-bottom: 0;
    }

    .vimeo-free-wrapper video, .vimeo-explain-wrapper video {
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

    @media only screen and (max-width: 600px) {

        .dark-fade {
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 70%, #151517 90%);
            height: 100%;
            width: 100%;
            position: absolute;
            opacity: 0;
        }
    
    }

</style>
