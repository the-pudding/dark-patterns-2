
<script>
    import { base } from "$app/paths";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import { fade } from "svelte/transition";
    import SpriteDark from "$components/SpriteDark.svelte";
	import inView from "$actions/inView.js";
    import { groups, format } from "d3";

    export let copySteps;
    export let cueData;
    export let sesameSprites;
    export let copy;
    
    let sticky;
    let stickyVisible;
    let scrollValue;
    let sprites;

    $: copyId = scrollValue ? scrollValue : 0;
    $: id = copySteps[copyId].id;
    $: bubbleText = copySteps[copyId]["text"];

    $: key = "floor"


    $: cues = cueData.filter((d) => d.id === id && d.sprite);
    $: sprites = groups(cues, (d) => {
        return d.key
    });
    const getSpriteData = (key) => sesameSprites.find((d) => d.id === key.split("_")[0]);

    console.log(getSpriteData("Big-Boss"))
</script>

<div
    class="sticky"
    bind:this={sticky}
    use:inView
    on:enter={() => (stickyVisible = true)}
    on:exit={() => (stickyVisible = false)}
>
    <div class="sprite-sandbox">
        <div class="sprite-container {key}" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
            {#each sprites as [key, spriteSteps] (key)}
                <SpriteDark text={bubbleText} id={id} steps={spriteSteps} name={key.split("_")[0]} data={getSpriteData(key)} />
            {/each}
        </div>
    </div>

</div>

<Scrolly bind:value={scrollValue}>
    {#each copySteps as step, i}
        {@const stepId = id === "intro" && i === 0 ? "scroll-to-start" : null}
        {@const active = scrollValue === i}

        <div id={stepId} class="step" class:active>
            {@html step}
            {@html i}
            {#if i == 1}
                <div class="company-scroll">
                    {#each copy["companies"].slice(0,5) as image}
                        <div class="company-image" style="margin-left:{Math.random()*100}%; width:{image.w}px"><img src="{base}/assets/{image.id}.png" /></div>
                    {/each}
                </div>
            {/if}
            {#if i == 2}
                <div class="company-scroll">
                    {#each copy["companies"].slice(5,copy["companies"].length) as image}
                        <div class="company-image" style="margin-left:{Math.random()*50}%; width:{image.w}px"><img src="{base}/assets/{image.id}.png" /></div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</Scrolly>

<style>

    .company-image {
        padding: 0;
        margin-bottom: 50px;
        align-self: center;
    }
    .sticky {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		position: sticky;
		top: 0;
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
