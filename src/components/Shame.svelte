<script>
    import { register } from 'swiper/element/bundle';
    // register Swiper custom elements
    register();
    let images = [1,2,3,4]
    let swiperEl;
    async function next(){
        swiperEl.swiper.slideNext();
    }
    async function previous(){
        swiperEl.swiper.slidePrev();
    }

</script>

<div class="slider-container">
    <p class="">Cancel-shaming Examples</p>

    <swiper-container free-mode="true" slides-per-view="auto" bind:this={swiperEl}>
        {#each images as image}
            <swiper-slide><img src="assets/cancel_{image}.png" alt=""></swiper-slide>
        {/each}
    </swiper-container>
    <div class="examples">
        <button on:click={() => previous()}>Previous Example</button>
        <button on:click={() => next()}>Next Example</button>
    </div>
    
</div>



<style>

    .examples {
        display: flex;
        justify-content: center;
    }
    button {
        margin: 5px;
        font-family: 'CozetteVector';
        font-size: 16px;
        background: rgba(0,0,0,.6);

    }
    p {
        font-family: 'CozetteVector';
        text-align: center;
        font-size: 18px;
    }

    .slider-container {
        margin: 50px auto;
        background: linear-gradient(180deg, #d5e2e5 0%, rgba(255,255,255,0) 100%);
        background: none;
    }
    img {
        max-width: 500px;
        padding: 25px;
    }
    h3 {
        font-family: '8Bit';
        font-size: 18px;
        color: #1e185a;
        text-align: center;
        padding-top: 50px;
    }

</style>
  