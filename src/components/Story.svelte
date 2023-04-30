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
    import Shame from "$components/Shame.svelte";
    import Montage from "$components/Montage.svelte"
    import DarkScrolly from "$components/DarkScrolly.svelte"
    import Vimeo from "$components/Vimeo.svelte"
    import RefundTable from "$components/RefundTable.svelte"
    import GoDark from "$components/GoDark.svelte";
    import { groups, format } from "d3";

    import { onMount, setContext, getContext } from "svelte";
    import cueData from "$data/cues.js";

    export let sesameSprites;
    export let copy;

    let darken = 0;
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
    

    $: console.log(darken)
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
            if(sliderCount > copy["companies"].length - 1){
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
    <div class="go-dark"
        style="opacity:{blockId == "title" ? darken/100 : 0};"
    >
    </div>
    <div class="grid-life">
    </div>
    <div class="dungeon">
        <div class="dungeon-tile">

        </div>
        <div class="dungeon-black">

        </div>
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
                    <GoDark bind:darken/>
                {:else if block == "experiment"}
                    <div
                    id="detect-start"
                    use:inView
                    on:enter={() => (test = "experiment")}
                    on:exit={() => (test = "title")}
                    />
                {:else if block == "happened"}
                    <Montage copySteps={copy[block]}/>
 
                {:else if block == "darkTypes"}
                    <DarkScrolly {blockId} copySteps={copy[block]}/>
                {:else if block == "vimeo"}
                    <Vimeo {copy} {cueData} id={copy[block][0]["id"]} {sesameSprites} copySteps={copy[block]} />
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
                                                        BASE={72}
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
                                                        BASE={72}
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
                    {:else if block == "happened"}
                        <div></div>
                    {:else if block == "vimeo"}
                        <div></div>
                    {:else}
                        <div class="section">
                            {#if Object.keys(sectionBlock).indexOf("hed") > -1 && block == "results"}
                                <p><span class="big">{sectionBlock.hed}</span></p>
                            {/if}
                            {#if sectionBlock["type"] == "body"}
                                {#each sectionBlock.text as sectionBlockText, n}
                                    <p class="running-text">{@html sectionBlockText.value}</p>
                                    {#if block == "results"}
                                        {#if sectionBlock.id == "first" && n == 1}
                                            <RefundTable copy={copy["companies"]}/>
                                        {/if}
                                        {#if sectionBlock.id == "third" && n == 2}
                                            <Shame />
                                        {/if}
                                    {/if}
                                {/each}
                            {:else if sectionBlock["type"] == "graphic-company-slider"}
                                <div class="slider-wrapper" style="width:400px;">
                                    <div class="companies" style="transform:translate(-{sliderCount*400}px,0)">
                                        {#each copy["companies"].filter(d => d.id != "null") as image}
                                            <div class="company-image" style="width:400px;">
                                                <img style="width:{image.w}px; height:{image.h}px" src="assets/{image.id}.png" />
                                            </div>
                                        {/each}
                                    </div>
                                    <FinderWindow record={true}/>
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
    h4 {
        font-family: 'CozetteVector';
        text-align: center;
        margin-bottom: 50px;
        font-size: 28px;
    }
    .happened {
        font-family: 'CozetteVector';
        text-align: center;
        font-size: 18px;
        margin-top: 0px;
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

    h3 {
        font-family: "CozetteVector";
        font-size: 20px;
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 50px;
        width: calc(100% - 20px);
    }

    .section {
        margin: 0 auto;
        position: relative;
    }

    .section-intro {
        margin: 0 auto;
    }


    

    p {
        font-size: 21px;
        line-height: 1.6;
        margin-bottom: 1.2em;
    }

    .titleinView p {
        -webkit-font-smoothing: antialiased;
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
        width: calc(100% - 20px);
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
        opacity: 0;
    }

    .vimeoinView .dungeon {
        opacity: 1;
        background: #011a18;
    }

    .experimentinView.wrapper, .happenedinView.wrapper, .darkTypesinView {
        background: linear-gradient(180deg, #FCEAFF 0%, #BFE0FF 100%);
    }

    .resultsinView.wrapper {
        background-color: #f3f2ff;
    }

    .titleinView h1 {
        background: linear-gradient(180deg, #FFF7B2 0%, #FFD7B3 71.09%);
        background-clip: text;
    }

    .titleinView h3, .titleinView p, .vimeoinView p {
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
        width: calc(100% - 20px);
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
        color: black;
        width: 100vw;
        overflow: hidden;
        margin-bottom: 200px;
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

    .dungeon, .go-dark, .grid-life, .dungeon-black, .dungeon-tile {
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

    .grid-life {
        opacity: 1;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAACgAgMAAADm7QMnAAAADFBMVEWHh4eysrKurq60tLTxWZFvAAAABHRSTlOAOBYpKphJMgAAAEVJREFUeNpjYA3FAA4Mq17tWrcalVhBtOBK7IL/McFfErSPWjRq0ahFoxaNWjRMLMJRoYzWR6MWjVo0atGoRaMWDYL6CAA67a9qtD47OgAAAABJRU5ErkJggg==);
    }

    .dungeon-tile {
        background-image: url('assets/tile.jpg');
        background-repeat: repeat;
        background-size: 380px 380px;
        opacity: .3;
        position: fixed;
    }

    .dungeon-black {
        opacity: 1;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #151517 100%);
        position: fixed;
    }


    @media only screen and (max-width: 1000px) {
        .aside-cookie {
            display: none;
        }
    }


    

</style>
