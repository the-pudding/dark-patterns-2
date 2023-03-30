<script>
    export let record;
</script>

<div class="finder">
    <div class="toolbar">
        <div class="dot">
        </div>
        <div class="dot yellow">
        </div>
        <div class="dot green">
        </div>
    </div>
    {#if record}
        <div class="record-wrapper">
            <div class="dot">
            </div>
            <p>REC</p>
        </div>
        
        <div class="crosshairs">
            <svg viewBox="0 0 66 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 1H1V28" stroke="#A1A3B4" stroke-width="2"/>
                <path d="M37 62L64.5 62L64.5 36" stroke="#A1A3B4" stroke-width="2"/>
                <path d="M38 1L65 1L65 28" stroke="#A1A3B4" stroke-width="2"/>
                <path d="M28 62L1 62L1 35" stroke="#A1A3B4" stroke-width="2"/>
                <line x1="33" y1="25" x2="33" y2="36" stroke="#A1A3B4" stroke-width="2"/>
                <line x1="27.5" y1="30.5" x2="38.5" y2="30.5" stroke="#A1A3B4" stroke-width="2"/>
            </svg>
        </div>

        <button class="cancel-wrapper">
            <span>CANCEL</span>
            <img src="assets/pointer.png" alt="">
        </button>
        
            
    {/if}
</div>

<style>

    .cancel-wrapper {
        position: absolute;
        right: 0px;
        left: 0px;
        bottom: 10px;
        background: linear-gradient(93.67deg, #FF2B25 -1.51%, #FF5925 110.1%);
        border-radius: 10px;
        margin: 0 auto;
        width: 110px;
        padding: 5px 10px;
    }
    .cancel-wrapper img {
        width: 30px;
        position: absolute;
        bottom: -20px;
        right: -10px;
    }
    .cancel-wrapper span {
        font-family: '8Bit';
        color: #FFF;
        margin: 0 auto;
        font-size: 11px;
    }
    .crosshairs {
        width: 65px;
        height: 63px;
        margin: 0 auto;
        left: 0;
        right: 0;
        position: absolute;
        top: 50%;
        transform: translate(0,-50%);
    }
    .record-wrapper {
        position: absolute;
        right: 10px;
        top: 30px;
        display: flex;
        animation: blink-animation 1s steps(5, start) infinite;
    }

    .record-wrapper .dot {
        align-self: center;
        margin-top: 2px;
        width: 12px;
        height: 12px;
    }

    .record-wrapper p {
        font-family: '8Bit';
        font-size: 11px;
        align-self: center;
        margin: 0;
    }


    .finder {
        width: 100%;
        height: 100%;
        position: absolute;
        border: 3px solid rgba(6,6,6,.3);
        border-radius: 10px;
        background: linear-gradient(109.95deg, rgba(255, 96, 96, 0.68) -0.21%, rgba(255, 255, 255, 0.64) -0.2%, rgba(255, 255, 255, 0) 100%);
        z-index: 1;
    }
    .toolbar {
        position: absolute;
        top: 0;
        width: 100%;
        height: 21px;
        background: linear-gradient(90.21deg, #FFFFFF -1.62%, rgba(239, 239, 239, 0) 100%);
        border-bottom: 3px solid rgba(6,6,6,.3);
        border-radius: 10px 10px 0px 0px;
        display: flex;
        padding: 8px;
        
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: rgba(255, 43, 37, 1);
        align-self: center;
        margin-right: 5px;
    }

    .yellow {
        background: rgba(255, 185, 0, 1);
    }

    .green {
        background: rgba(0, 171, 71, 1);
    }

    @keyframes blink-animation {
    to {
        visibility: hidden;
    }
    }
    @-webkit-keyframes blink-animation {
    to {
        visibility: hidden;
    }
    }

</style>