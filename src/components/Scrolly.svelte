
<script>
    import { base } from "$app/paths";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import { fade } from "svelte/transition";
    import SpriteDark from "$components/SpriteDark.svelte";
    import SpriteWrapper from "$components/SpriteWrapper.svelte";

    import FinderWindow from "$components/FinderWindow.svelte"
	import inView from "$actions/inView.js";
    import { groups, format } from "d3";

    export let copySteps;
    export let cueData;
    export let sesameSprites;
    export let copy;


    let sticky;
    let test;
    let scrollValue;
    let sprites;

    $: copyId = scrollValue ? scrollValue : 0;
    $: id = copySteps[copyId].id;
    $: bubbleText = copySteps[copyId]["text"];
    $: cues = cueData.filter((d) => d.id === id && d.sprite);
    $: sprites = groups(cues, (d) => {
        return d.key
    });

    $: console.log(id);

    // const getSpriteData = (key) => sesameSprites.find((d) => d.id === key.split("_")[0]);

</script>

<div
    class="sticky"
    bind:this={sticky}
    use:inView={{ progress: true }}
    on:enter={() => (test = true)}
    on:exit={() => (test = false)}
    >

    <SpriteWrapper bubbleText={bubbleText} id={id} sprites={sprites} cueData={cueData} sesameSprites={sesameSprites} />
    
    <!-- <div class="sprite-sandbox">
        <div class="sprite-container">
            {#each sprites as [key, spriteSteps] (key)}
                <SpriteDark text={bubbleText} id={id} steps={spriteSteps} name={key.split("_")[0]} data={getSpriteData(key)} />
            {/each}
        </div>
    </div> -->

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
            {#if i == 1}
                <div
                    use:inView={{ progress: true }}
                    on:progress={(e) => console.log()}    
                    class="company-scroll"
                    
                >
                    {#each copy["companies"].slice(0,5) as image}
                        <div class="company-image" style="margin-left:{Math.random()*100}%; width:{image.w}px">
                            <FinderWindow />
                            <img src="assets/{image.id}.png" />
                        </div>
                    {/each}
                </div>
            {/if}
            {#if i == 2}
                <div class="company-scroll">
                    {#each copy["companies"].slice(5,copy["companies"].length) as image}
                        <div class="company-image" style="margin-left:{Math.random()*50}%; width:{image.w}px">
                            <FinderWindow />
                            <img src="assets/{image.id}.png" />
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</Scrolly>

<style>

    .company-image {
        margin-bottom: 50px;
        align-self: center;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .company-image img {
        margin: 0 auto;
        padding: 2rem;
        justify-content: center;
        z-index: 100;
        margin-top: 25px;
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
        justify-content: center;
        flex-wrap: wrap;
        flex-direction: column;
        margin-left:-100px;
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
        min-height: 100vh;
        max-width: 100%;
    }

    .step:first-of-type {
		margin-top: -50vh;
        min-height: 50vh;
	}
</style>
