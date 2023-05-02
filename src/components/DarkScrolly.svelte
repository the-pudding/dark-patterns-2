<script>
    import ScrollyHelper from "$components/helpers/Scrolly.svelte";
    import ButtonSet from "./helpers/ButtonSet.svelte";
    import DemoButtonSet from "$components/demo/Demo.ButtonSet.svelte";
    import { fade } from 'svelte/transition';
	import { select } from "d3";
    import { onMount, setContext, getContext } from "svelte";


    export let copySteps;
    export let blockId;
    export let ariaVideoKey;

    let videoEl;
    let currentTime = 0;
    let sticky;
    let videoTimeout;
    let scrollValue;
	let duration;
    let binded = "Savage Fenty";
    let loaded = false;

    let imageOverride = ["Hulu","Netflix","Paramount Plus"];

    let imageCrossWalk = ["savage_fenty_2"];
    let selectedCompany;

    
    $: widthElapsed = toPercent(progress, duration);
	$: progress = currentTime || 0;

    $: scrollOverride = scrollValue || 0;

    $: scrollOverride, getVideo();

    // $: options = scrollOverride > -1 ? copySteps[scrollOverride]["options"].split(",").map(d => {
    //     console.log(d)
    //     if(d == "Savage Fenty 2") {
    //         return {"value": d,"label":"Savage Fenty"};
    //     }
    //     return {"value": d,"slug":d};
    // }) : [];

    $: selectedCompany, loadVideo();

    $: blockId == "darkTypes", loadVideo();

    $: console.log(selectedCompany)

    $: binded, selectedCompany = binded;

    async function getVideo(){
        let activeOptions = copySteps[scrollOverride]["options"].split(",").map(d => { return d});
        selectedCompany = activeOptions[0];
        console.log(selectedCompany, imageOverride.indexOf(selectedCompany))
    }

    async function loadVideo(){
        if(binded && videoEl && imageOverride.indexOf(selectedCompany) == -1 && blockId == "darkTypes"){
            clearTimeout(videoTimeout);
            videoEl.currentTime = 0;
            loaded = false;
            let src = `assets/${selectedCompany.toLowerCase().replace(" ","_").replace(" ","_")}.mp4`;
            const request = new XMLHttpRequest();
            request.open("GET", src, true);
            request.responseType = "blob";
            request.onload = function () {
                if (this.status === 200) {
                    const videoBlob = this.response;
                    const videoUrl = URL.createObjectURL(videoBlob);
                    videoEl.src = videoUrl;
                    videoEl.currentTime = 0;
                    
                    videoTimeout = setTimeout(function() {
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
    {#key selectedCompany}
    <div class="montage video-wrapper">
        {#if imageOverride.indexOf(selectedCompany) > -1}
            <img
                src="assets/{selectedCompany.toLowerCase().replace(" ","_").toLowerCase().replace(" ","_")}_pattern.png"
                alt="image showing emails from {selectedCompany} after unsubscribing"
            >
        {/if}
            <video
                muted loop preload="none"
                playsinline
                webkit-playsinline="webkit-playsinline"
                in:fade={{ duration: 1000 }} 
                style="display:{imageOverride.indexOf(selectedCompany) > -1 ? 'none' : 'block'};"
                bind:this={videoEl} bind:currentTime bind:duration
                aria-label={ariaVideoKey.get(selectedCompany)}
            >
            </video>
        <div
            class="progress"
            style="display:{imageOverride.indexOf(selectedCompany) > -1 ? "none" : ''};"
        >
			<span style:width={widthElapsed} class="elapsed" />
			<span class="cut">
            </span>
		</div>
        <div class="white-background" class:loaded>
            <p>Loading...</p>
        </div>
    </div>
    {/key}
</div>

<ScrollyHelper top={-100} bind:value={scrollValue}>
    {#each copySteps as step, i}
        {@const active = scrollValue === i}

        {@const options = step.options.split(",").map(d => {
            if(d == "Savage Fenty 2") {
                return {"value": d,"label":"Savage Fenty"};
            }
            return {"value": d,"slug":d}; })}

            <div
                class="step"
                class:active
                style="padding-top:{i == 0 ? "0px" : ''}; padding-bottom:{i == (copySteps.length - 1) ? "50vh" : ''};"
            >
                <div class="step-wrapper">
                    {#if step["type"] == "darkStep"}
                        <p class="dark-hed">{@html step.hed}</p>
                        {#each step.text as sectionBlockText}
                            <p class="running-text">{@html sectionBlockText.value}</p>
                        {/each}
                    {/if}
                    <div class="chooser"
                        style="visibility:{options.length > 1 ? "" : "hidden"};"
                    >
                        <div class="options">
                            <ButtonSet {selectedCompany} legend={"View Dark Pattern for"} {options} bind:binded />
                        </div>
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
        min-height: 120px;
        visibility: hidden;
    }

    .active .chooser {
        visibility: visible;
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
        max-width: 450px;
        width: 100%;
    }

    .video-wrapper video, .video-wrapper img {
        width: 100%;
        aspect-ratio: 1;
        margin: 0 auto;
        position: relative;
    }

    .video-wrapper video:after {
        content: '';
        background-color: white;
        position: absolute;
        top: 0;
        left: 0;
    }

    .video-wrapper .progress {
        height: 10px;
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
        background:#C4C4C5;
    }

    .video-wrapper .white-background {
        width: 100%;
        background-color: white;
        aspect-ratio: 1;
        position: absolute;
        display: block;
        z-index: -1;
    }

    .video-wrapper .loaded {
        display: block;
    }

    .white-background p {
        font-family: 'CozetteVector';
        text-align: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translate(0,-50%);
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
        padding-top: 50vh;
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

    @media only screen and (max-width: 700px) {
        .sticky {
            max-width: 100%;
            margin: 0 auto;
            width: calc(100% - 20px);
            z-index: -1;
        }

        .step-wrapper {
            background-color: rgba(221,225,248,.8);
        }

        .step {
            padding-bottom: 100vh;
            max-width: 100%;
        }

    }



</style>