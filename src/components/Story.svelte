<script>
    import { base } from "$app/paths";
    import mq from "$stores/mq.js";
    import { writable } from "svelte/store";
    import viewport from "$stores/viewport.js";

    import Header from "$components/Header.svelte";
    import preload from "$utils/preload.js";
    import Scrolly from "$components/Scrolly.svelte"
    import { onMount, setContext, getContext } from "svelte";
    import cueData from "$data/cues.js";

    export let sesameSprites;
    export let copy;

    let blocks;
    blocks = Object.keys(copy);

    const UNITS_X = 10;
    const UNITS_Y = 4;
    const BASE = 96;
    const SIZE = BASE * UNITS_X;
    const MAX_SCALE = 4;
    const HEIGHT_BP = 960;

    let scale = writable();

    const calcScale = (w, h) => {
        if (mobile) return w / SIZE;

        let widthScale = Math.min(MAX_SCALE, w / SIZE);

        if (widthScale < 4) widthScale -= 0.5;
        else widthScale -= 0.2;

        const min = 540;
        const upper = Math.min(Math.max(min, h), HEIGHT_BP);
        const factor = 0.5 + ((upper - min) / (HEIGHT_BP - min)) * 0.45;
        const shrink = factor * widthScale;

        return shrink;
    };
    
    $: mobile = !$mq.lg;
    $: scale.set(calcScale($viewport.width, $viewport.height));
    $: margin = Math.ceil(($viewport.width - $scale * BASE * UNITS_X) / 2);
    $: setContext("Game", { scale, BASE });


    onMount(() => {
        preload(cueData);
    });

</script>

<div class="wrapper">
    {#each blocks as block}
        <div class="block-wrapper {block == "intro" ? "intro" : ''}">
            {#if block == "intro"}
                <Header />
                <Scrolly {copy} {cueData} id={copy[block][0]["id"]} {sesameSprites} copySteps={copy[block]} />
            {/if}
            {#each copy[block] as sectionBlock}
                {#if block == "title"}
                    <div class="section-intro">
                        {#if sectionBlock.id == "hed"}
                            <h1>{@html sectionBlock.text}</h1>
                        {:else if sectionBlock.id == "dek"}
                            <h3>{@html sectionBlock.text}</h3>
                        {:else if sectionBlock.id == "byline"}
                            <p class="byline">{@html sectionBlock.text}</p>
                        {:else}
                            <p>{@html sectionBlock.text}</p>
                        {/if}
                    </div>
                {:else}
                    <div class="section">
                        {#if sectionBlock["type"] == "subhead"}
                            <p>{sectionBlock.text}</p>
                        {/if}

                        {#if sectionBlock["type"] == "body"}
                            {#each sectionBlock.text as sectionBlockText}
                                    <p>{@html sectionBlockText.value}</p>
                            {/each}
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
<style>

    h1 {
        font-family: "8Bit";
        color: #240E40;
        font-size: 64px;
        text-align: center;
        text-shadow: 1px 1px 1px rgba(255,7,7,.47), -1px -1px 1px rgba(255,255,255,.48), -1px 1px 1px rgba(255,255,255,.43), 1px -1px 1px rgba(249,249,249,.48);
    }

    h3 {
        font-family: "CozetteVector";
        font-size: 20px;
        text-align: center;
        width: calc(100% - 50px);
        max-width: 600px;
        margin: 0 auto;
    }

    .section {
        max-width: 550px;
        margin: 0 auto;
    }

    .section-intro {
        margin: 0 auto;
        max-width: 900px;
        width: calc(100% - 50px);
    }

    p {
        font-size: 21px;
        -webkit-font-smoothing: antialiased;
        line-height: 1.6;
        margin-bottom: 1.2em;
    }

    .byline {
        font-family: "CozetteVector";
        font-size: 16px;
        margin: 0 auto;
        text-align: center;
        margin-top: 48px;
        margin-bottom: 64px;
    }

    .wrapper {
        background: linear-gradient(180deg, #FBD6CD 0%, #EFDAB9 100%);;
        max-width: 100%;
        color: black;
    }

    .section-cold-intro {
        position: relative;
    }
</style>
