<script>
    import { base } from "$app/paths";
    import mq from "$stores/mq.js";
    import FinderWindow from "$components/FinderWindow.svelte"
    import { writable } from "svelte/store";
    import viewport from "$stores/viewport.js";
    import inView from "$actions/inView.js";
    import Header from "$components/Header.svelte";
    import preload from "$utils/preload.js";
    import Scrolly from "$components/Scrolly.svelte"
    import ScrollyHelper from "$components/helpers/Scrolly.svelte";
    import SpriteWrapper from "$components/SpriteWrapper.svelte";
    import { groups, format } from "d3";

    import { onMount, setContext, getContext } from "svelte";
    import cueData from "$data/cues.js";

    export let sesameSprites;
    export let copy;


    let toDrop = ["notes","companies"]
    let blocks;
    let test;
    blocks = Object.keys(copy).filter(d => {
        return toDrop.indexOf(d) == -1;
    });
    
    let scrollValue;
    let scale = writable();
    let section = "aside_1"
    let sliderCount = 0;
    let sliderInterval;

    const UNITS_X = 10;
    const UNITS_Y = 4;
    const BASE = 96;
    const SIZE = BASE * UNITS_X;
    const MAX_SCALE = 4;
    const HEIGHT_BP = 960;

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

    $: blockId = blocks[scrollValue];

    $: blockId == "experiment" ? runSlider() : clearSlider();

    function clearSlider(){
        clearInterval(sliderInterval)
    }

    function runSlider(){
        console.log("slidinggggggg")

        sliderInterval = setInterval(function(){
            if(sliderCount > copy["companies"].length){
                sliderCount = 0;
            }
            else {
                sliderCount = sliderCount + 1;
            }
            
        },3000)
    }

    onMount(() => {
        preload(cueData);
    });

</script>

<div class="wrapper {`${blockId}inView`}">
    <div class="go-dark">
    </div>

    <ScrollyHelper bind:value={scrollValue}>
        {#each blocks as block, i}
            {@const active = scrollValue === i}

            <div 
                class="block-wrapper {block ? block : ''}"
                class:active
            >
                {#if block == "intro"}
                    <Header />
                    <Scrolly {copy} {cueData} id={copy[block][0]["id"]} {sesameSprites} copySteps={copy[block]} />
                    <div
                    id="detect-start"
                    use:inView
                    on:enter={() => (test = "intro")}
                    />

                {:else if block == "title"}
                    <div
                    id="detect-start"
                    style="height: 100%;"
                    use:inView
                    on:enter={() => (test = "title")}
                    on:exit={() => (test = "exit")}

                    />
                {:else if block == "experiment"}
                    <div
                    id="detect-start"
                    use:inView
                    on:enter={() => (test = "experiment")}
                    on:exit={() => (test = "title")}
                    />
                {/if}

                {#each copy[block] as sectionBlock}
                    {#if block == "title"}
                        <div
                        class="section section-intro"
                        >
                            {#if sectionBlock.id == "hed"}
                                <h1>{@html sectionBlock.text}</h1>
                            {:else if sectionBlock.id == "dek"}
                                <h3>{@html sectionBlock.text}</h3>
                            {:else if sectionBlock.id == "byline"}
                                <p class="byline">{@html sectionBlock.text}</p>
                            {:else if sectionBlock["type"] == "body"}
                                {#each sectionBlock.text as sectionBlockText, blockCount}
                                        <div class="running-text-wrapper">
                                            {#if blockCount == 1}
                                                <div class="aside-cookie">
                                                    <SpriteWrapper
                                                        section={`aside_1`}
                                                        BASE={48}
                                                        bubbleText={`Accept our cookies without reading why.`}
                                                        id={`aside_1`}
                                                        sprites={groups(cueData.filter((d) => d.id === `aside_1` && d.sprite), (d) => {
                                                            return d.key
                                                        })}
                                                        cueData={cueData}
                                                        sesameSprites={sesameSprites} 
                                                    />
                                                </div>
                                            {/if}
                                            {#if blockCount == 2}
                                                <div class="aside-cookie aside-2">
                                                    <SpriteWrapper
                                                        section={`aside_2`}
                                                        BASE={48}
                                                        bubbleText={`You have 00:00:10 seconds to buy`}
                                                        id={`aside_2`}
                                                        sprites={groups(cueData.filter((d) => d.id === `aside_2` && d.sprite), (d) => {
                                                            return d.key
                                                        })}
                                                        cueData={cueData}
                                                        sesameSprites={sesameSprites} 
                                                    />
                                                </div>
                                            {/if}

                                            <p class="running-text {blockCount}">{@html sectionBlockText.value}</p>
                                        </div>
                                {/each}
                            {:else}
                                <p>{@html sectionBlock.text}</p>
                            {/if}
                        </div>
                    {:else}
                        <div class="section">
                            {#if sectionBlock["type"] == "body"}
                                {#each sectionBlock.text as sectionBlockText}
                                    <p class="running-text">{@html sectionBlockText.value}</p>
                                {/each}
                            {:else if sectionBlock["type"] == "graphic-company-slider"}
                                <div class="slider-wrapper" style="width:400px;">
                                    <div class="companies" style="transform:translate(-{sliderCount*400}px,0)">
                                        {#each copy["companies"] as image}
                                            <div class="company-image" style="width:400px;">
                                                <img style="width:{image.w}px; height:{image.h}px" src="assets/{image.id}.png" />
                                            </div>
                                        {/each}
                                    </div>
                                    <FinderWindow record={true}/>
                                </div>
                            {:else if sectionBlock["type"] == "exit-happened"}
                                
                                <div class="happened">
                                    <p>Here is</p>
                                    <p>what</p>
                                    <p>happened</p>
                                </div>

                            {/if}
                        </div>
                    {/if}
                {/each}
            </div>
        {/each}
    </ScrollyHelper>

</div>
<style>
    .happened {
        font-family: '8Bit';
        margin-top: 300px;
        margin-bottom: 35vh;
    }
    .experiment .happened p {
        text-align: center;
        margin: 50px auto;
        color: #25304F;
        font-size: 24px;
    }
    .companies {
        display: flex;
        position: absolute;
        margin-top: 30px;
        z-index: 10000;
        transition: transform 1s;
    }
    .companies .company-image {
        align-self: center;
    }
    .companies .company-image img {
        margin: 0 auto;
    }
    h1 {
        font-family: "8Bit";
        color: #240E40;
        font-size: 96px;
        text-align: center;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    h3 {
        font-family: "CozetteVector";
        font-size: 20px;
        text-align: center;
        width: calc(100% - 50px);
        max-width: 600px;
        margin: 0 auto;
        margin-top: 50px;
    }

    .section {
        margin: 0 auto;
        position: relative;
    }

    .section-intro {
        margin: 0 auto;
        width: calc(100% - 50px);
    }

    p {
        font-size: 21px;
        -webkit-font-smoothing: antialiased;
        line-height: 1.6;
        margin-bottom: 1.2em;
    }

    .block-wrapper {
        position: relative;
        z-index: 100;
    }

    .byline {
        font-family: "CozetteVector";
        font-size: 16px;
        margin: 0 auto;
        text-align: center;
        margin-top: 24px;
        margin-bottom: 200px;
    }

    #detect-start {
        height: 5em;
        position: absolute;
        top: 0;
        width: 100%;
    }

    .wrapper {
        background-color: #FBD6CD;
        max-width: 100%;
        color: black;
        width: 100vw;
        position: relative;
    }

    .titleinView .go-dark {
        opacity: 1;
    }

    .experimentinView.wrapper {
        background: linear-gradient(180deg, #FCEAFF 0%, #BFE0FF 100%);
    }

    .titleinView h1 {
        background: linear-gradient(180deg, #FFF7B2 0%, #FFD7B3 71.09%);
        background-clip: text;
    }

    .titleinView h3, .titleinView p {
        color: white;
    }

    .running-text-wrapper {
        position: relative;
    }

    .running-text {
        max-width: 550px;
        margin: 0 auto;
        font-size: 18px;
        margin-bottom: 1.5rem;
    }

    .section-cold-intro {
        position: relative;
    }

    .title {
        padding-bottom: 45vh;
        overflow: hidden;
        width: 100vw;
    }

    .experiment {
        min-height: 100vh;
        color: black;
        width: 100vw;
        overflow: hidden;
    }

    .experiment p {
        color: black;
    }

    .aside-cookie {
        width: calc(calc(100% - 550px)/2);
        height: 100px;
        position: absolute;
    }

    .aside-2 {
        right: 0;
        left: auto;
    }

    .slider-wrapper {
        width: 100%;
        max-width: 400px;
        height: 200px;
        position: relative;
        margin: 0 auto;
        margin-top: 100px;
        margin-bottom: 50px;
    }

    .go-dark {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0;
        z-index: 1;
        transition: opacity .5s;
    }
</style>
