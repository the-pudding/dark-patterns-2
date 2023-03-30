<script>
    import SpriteDark from "$components/SpriteDark.svelte";
    import { groups, format } from "d3";

    export let cueData;
    export let sesameSprites;
    export let id;
    export let bubbleText;
    export let sprites;
    export let section;
    export let BASE;

    $: key = "floor"
    $: cues = cueData.filter((d) => d.id === id && d.sprite);
    $: sprites = groups(cues, (d) => {
        return d.key
    });

    $: console.log(section);

    const getSpriteData = (key) => sesameSprites.find((d) => d.id === key.split("_")[0]);
</script>

<div class="sprite-sandbox">
    <div class="sprite-container">
        {#each sprites as [key, spriteSteps] (key)}
            <SpriteDark BASE={BASE} section={section} text={bubbleText} id={id} steps={spriteSteps} name={key.split("_")[0]} data={getSpriteData(key)} />
        {/each}
    </div>
</div>

<style>
    .sprite-sandbox {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        display: none;
    }

    .sprite-container {
        width: 100%;
        height: 100%;
        max-height: 500px;
        position: absolute;
        top: 50%;
        transform: translate(0,-50%);
    }

</style>

