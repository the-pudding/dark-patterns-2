<script>
    import { register } from 'swiper/element/bundle';
    // register Swiper custom elements
    register();
    let images = [1,2,3,4]
</script>

<div class="slider-container">
    <h3>Cancel-shaming Wall of Shame</h3>

    <swiper-container free-mode="true" slides-per-view="auto">
        {#each images as image}
            <swiper-slide><img src="assets/cancel_{image}.png" alt=""></swiper-slide>
        {/each}
    </swiper-container>
</div>



<style>
    .slider-container {
        margin: 50px auto;
        background: linear-gradient(180deg, #d5e2e5 0%, rgba(255,255,255,0) 100%);
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
  