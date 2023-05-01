<script>
    import SpriteDark from "$components/SpriteDark.svelte";
    import { onMount } from "svelte";

    import { groups } from "d3";

    export let cueData;
    export let sesameSprites;
    export let id;
    export let bubbleText;
    export let sprites;
    export let section;
    export let BASE;
    export let floatBottom;
    export let hideBubble

    let mounted = false;

    let wrapper = 0;
    let wrapperHeight = 0;

    $: key = "floor"
    $: cues = cueData.filter((d) => d.id === id && d.sprite);
    $: sprites = groups(cues, (d) => {
        return d.key
    });

    const getSpriteData = (key) => sesameSprites.find((d) => d.id === key.split("_")[0]);
    onMount(() => {
        mounted = true;
    })
</script>

{#if mounted}
    <div class="sprite-sandbox">
        <div class="sprite-container" class:floatBottom bind:offsetHeight={wrapperHeight} bind:offsetWidth={wrapper}>
            <div class="spriteOn">
                {#each sprites as [key, spriteSteps] (key)}
                    <SpriteDark {wrapperHeight} {wrapper} hideBubble={hideBubble} BASE={BASE} section={section} text={bubbleText} id={id} steps={spriteSteps} name={key.split("_")[0]} data={getSpriteData(key)} />
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .sprite-sandbox {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: block;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .spriteOn {
        display: none;
    }

    .sprite-container {
        width: 100%;
        height: 100%;
        max-height: 500px;
        display: block;
        position: absolute;
        top: 50%;
        transform: translate(0,-50%);
    }
    .floatBottom {
        display: block;
        top: auto;
        bottom: 0;
        transform: none;
    }

</style>

