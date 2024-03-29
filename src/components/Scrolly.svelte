
<script>
    import { base } from "$app/paths";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import { fade } from "svelte/transition";
    import SpriteDark from "$components/SpriteDark.svelte";
    import SpriteWrapper from "$components/SpriteWrapper.svelte";
    import viewport from "$stores/viewport.js";

    import FinderWindow from "$components/FinderWindow.svelte"
	import inView from "$actions/inView.js";
    import { groups, scaleLinear } from "d3";

    export let copySteps;
    export let cueData;
    export let sesameSprites;
    export let copy;
    export let preloaded;

    let sticky;
    let test;
    let scrollValue;
    let sprites;
    let clientWidth;
    let scaleBase = scaleLinear().domain([1500,400]).range([0,1]).clamp(true);

    $: copyId = scrollValue ? scrollValue : 0;
    $: id = copySteps[copyId].id;
    $: bubbleText = copySteps[copyId]["text"];
    $: cues = cueData.filter((d) => d.id === id && d.sprite);
    $: sprites = groups(cues, (d) => {
        return d.key
    });
</script>

<div
    class="sticky"
    bind:this={sticky}
    use:inView={{ progress: true }}
    on:enter={() => (test = true)}
    on:exit={() => (test = false)}
    >
    <SpriteWrapper BASE={96-(64*scaleBase($viewport.width))} bubbleText={bubbleText} id={id} sprites={sprites} cueData={cueData} sesameSprites={sesameSprites} />
</div>

<Scrolly bind:value={scrollValue}>
    {#each copySteps as step, i}
        {@const stepId = id === "intro" && i === 0 ? "scroll-to-start" : null}
        {@const active = scrollValue === i}

        <div
            id={step.id}
            class="step {stepId} {i == 0 ? "first" : ''}"
            class:active
        >

            {#if i == 0}
                <p>Scroll to Continue</p>
            {/if}
            {#if i == 1}
                <div
                    use:inView={{ progress: true }}
                    class="company-scroll"                    
                >
                    {#each copy["companies"].filter(d => d.id != "null") as image}
                        <div class="company-image" style="margin-left:{Math.random()*90}%; width:{image.w}px">
                            <FinderWindow />
                            {#if preloaded}
                                <img src="assets/{image.id}.png" alt="{image.id} logo"/>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</Scrolly>

<style>



    .landscape, .pink {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: -1;
        position: absolute;
    }

    .landscape {
        background-image: url('assets/landscape.png');
        background-size: cover;
    }

    .pink {
        background: pink;
    }

    .company-image {
        margin-bottom: 50px;
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
    }

    .company-image img {
        margin: 0 auto;
        justify-content: center;
        z-index: 100;
        width: calc(100% - 50px);
        margin-top: 50px;
        margin-bottom: 30px;
    }
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

    .company-scroll {
        display:flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        flex-direction: column;
    }

    .sprite-container {
        width: 100%;
        display: block;
        height: 100%;
        max-height: 500px;
        position: absolute;
        top: 50%;
        transform: translate(0,-50%);
    }

    .step {
        min-height: 100vh;
        max-width: 100%;
        overflow: hidden;
    }

    .first {
        margin-top: -100vh;
        min-height: 100vh;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        opacity: .2;
        transition: opacity .5s;
    }

    .first.active {
        opacity: 1;
    }

    .first p {
        margin-bottom: 150px;
        text-align: center;
        font-size: 24px;
        font-family: 'CozetteVector',"sans";
        color: rgba(0,0,0,.7);
    }

</style>
