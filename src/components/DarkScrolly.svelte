<script>
    import ScrollyHelper from "$components/helpers/Scrolly.svelte";
    import ButtonSet from "./helpers/ButtonSet.svelte";
    import DemoButtonSet from "$components/demo/Demo.ButtonSet.svelte";
    import { fade } from 'svelte/transition';

    export let copySteps;
    export let blockId;

    let videoEl;
    let currentTime = 0;
    let sticky;
    let scrollValue;
	let duration;
    let binded = "savage_fenty";
    let loaded = false;

    let imageOverride = ["Hulu","Netflix","Paramount Plus"];

	$: widthElapsed = toPercent(progress, duration);
	$: progress = currentTime || 0;

    $: scrollOverride = scrollValue || 0;


    $: console.log(scrollValue);

    $: options = scrollOverride > -1 ? copySteps[scrollOverride]["options"].split(",").map(d => {
        return {"value": d};
    }) : [];

    $: binded, loadVideo();

    $: blockId == "darkTypes", loadVideo();

    async function loadVideo(){
        console.log(binded,videoEl)
        if(binded && videoEl){
            videoEl.currentTime = 0;
            loaded = false;
            let src = `assets/${binded.toLowerCase().replace(" ","_").replace(" ","_")}.mp4`;
            const request = new XMLHttpRequest();
            request.open("GET", src, true);
            request.responseType = "blob";
            request.onload = function () {
                if (this.status === 200) {
                    const videoBlob = this.response;
                    const videoUrl = URL.createObjectURL(videoBlob);
                    videoEl.src = videoUrl;
                    videoEl.currentTime = 0;
                    
                    setTimeout(function() {
                        videoEl.play();
                    }, 1000)
                    
                    
                }
            };
            request.send();
            loaded = true;
        }
    }

    const toPercent = (a, b = 1) => `${(a / b) * 100}%`;

</script>

<div
    class="sticky"
    bind:this={sticky}
>
    {#key binded}
    <div in:fade={{ duration: 1000 }} class="montage video-wrapper">
        <!-- <div class="chooser">
            <div class="options">
                {#key options}
                    <ButtonSet legend={"View Dark Pattern for"} {options} bind:binded />
                {/key}
            </div>
        </div> -->
        {#if binded}
            <img 
                style="display:{imageOverride.indexOf(binded) > -1 ? 'block' : 'none'};"
                src="assets/{binded.toLowerCase().replace(" ","_").toLowerCase().replace(" ","_")}_pattern.png" alt=""
            >
            <video 
                style="display:{imageOverride.indexOf(binded) > -1 ? 'none' : 'block'};"
                src="assets/{binded.toLowerCase().replace(" ","_").replace(" ","_")}.mp4"
                muted loop bind:this={videoEl} bind:currentTime bind:duration>
            </video>
        {/if}
        <div
            class="progress"
            style="display:{imageOverride.indexOf(binded) > -1 ? "none" : ''};"
        >
			<span style:width={widthElapsed} class="elapsed" />
			<span class="cut">
            </span>
		</div>
    </div>
    {/key}
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
                <div class="chooser"
                    style="display:{options.length > 1 ? "block" : "none"};"
                >
                    <div class="options">
                    {#key options}
                        <ButtonSet legend={"View Dark Pattern for"} {options} bind:binded />
                    {/key}
                    </div>
                </div>
            </div>
    {/each}
</ScrollyHelper>

<style>

    .chooser {
        margin: 0 auto;
        max-width: 400px;
        width: 100%;
        padding: 1rem;
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

    .video-wrapper video, .video-wrapper img {
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
        font-family: 'Lyon','serif';
    }

    p.active {
        color: black;
        text-decoration: underline;
        text-decoration-color: rgba(0,0,0,.3);
    }
</style>