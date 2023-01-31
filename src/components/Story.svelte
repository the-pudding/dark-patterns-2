<script>
    export let copy;

    let blocks;
    blocks = Object.keys(copy);
    console.log(copy)
    // blocks = copy.keys();
</script>

{#each blocks as block}
    <!-- <h1>{block}</h1> -->

    {#each copy[block] as sectionBlock}
        <div class="section">
            {#if block == "intro"}
                {#each sectionBlock.text as sectionBlockText}
                    <p>{sectionBlockText.value}</p>
                {/each}
            {:else if block == "title"}
                <p>{sectionBlock.text}</p>
            {:else}

                {#if sectionBlock["type"] == "subhead"}
                    <p>{sectionBlock.text}</p>
                {/if}

                {#if sectionBlock["type"] == "body"}
                    {#each sectionBlock.text as sectionBlockText}
                            <p>{sectionBlockText.value}</p>
                    {/each}
                {/if}
            {/if}
        </div>
    {/each}
{/each}

<style>
    .section {
        max-width: 550px;
        margin: 0 auto;
        margin-bottom: 100px;
    }

    p {
        font-size: 18px;
        font-family: 'Inter';
    }
</style>
