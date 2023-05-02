<script>
	import Scroller from '@sveltejs/svelte-scroller';

    export let darken;
    let index, offset, progress;
    let threshold = 1;
    let top = 1;
    $: darken = clamp(progress,0,1);
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

</script>
    <div class="hi">

    <Scroller top="{top}" bottom="{0}" {threshold} bind:index bind:offset bind:progress>    
        <div slot="background"> 
        </div>
        
          <div slot="foreground">
            <section>  </section>
          </div>
    </Scroller>
    </div>

<style>
  section {
    height: 25vh;
  }

</style>