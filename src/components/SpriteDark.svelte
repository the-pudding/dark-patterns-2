<script>
import { base } from "$app/paths";
import { onMount, getContext } from "svelte";
import { tweened } from "svelte/motion";
import runWithCancel from "$utils/runWithCancel.js";
import { fade } from "svelte/transition";
import viewport from "$stores/viewport.js";
import mq from "$stores/mq.js";

export let steps;
export let name;
export let data;
export let id;
export let text;
export let section;
export let BASE = 96;
// const { scale, BASE } = getContext("Game");


const UNITS_X = 10;
const UNITS_Y = 4;

const MAX_SCALE = 4;
const HEIGHT_BP = 960;

const calcScale = (w, h) => {
    if(wrapper < 500) {
      return wrapper/SIZE;
    }

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
$: wrapper, scale = calcScale($viewport.width, $viewport.height);
$: margin = Math.ceil(($viewport.width - scale * BASE * UNITS_X) / 2);
$: SIZE = BASE * UNITS_X;
let scale = 1;
let white = "#FFFFFF";
const FRAMERATE = 100;
let tween = tweened({ x: 10, y: 0, r: 0 });
let cycleInterval;
let textInterval;
let frameIndex = 0;
let flip;
let bubbleTextCounter;
let z;
let wrapper;
let interval;

$: bubbleText = text.split(" ").map(d => {
  return d + "&nbsp;";
})

$: bubbleText, bubbleTextCounter = 0;

$: text, textUpdate();

$: cancelFn = start(id);

$: frame = data.frames.find((d) => d.index === frameIndex);

$: x = `${$tween.x * scale * BASE}px`;
$: y = `${$tween.y * scale * BASE * -1}px`;
$: s = flip ? -1 : 1;

$: bgImage = `assets/${name}.png`;
$: bgPos = `${scale * frame.x * -1}px ${scale * frame.y * -1}px`;
$: bgSize = `calc(100% * ${data.cols}) calc(100% * ${data.rows})`;
$: transform = `translate3d(${x}, ${y}, 0) scaleX(${s})`;
$: width = `${data.size * scale}px`;
$: height = `${data.size * scale}px`;
$: zIndex = z || 1;

const pause = (delay) => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };

  const makeObj = (step, prefix) => {
    return Object.keys(step)
      .filter((d) => d.includes(prefix))
      .reduce((prev, cur) => {
        prev[cur.replace(prefix, "")] = step[cur] || 0;
        return prev;
      }, {});
  };

  const move = async (step) => {
    const start = makeObj(step, "start_");
    const end = makeObj(step, "end_");
    const { duration } = step;
    tween = tweened(start, { duration });
    await tween.set(end);
    return;
  };

  const textUpdate = async () => {
    if (textInterval) clearInterval(textInterval);

    let i = 0;
    let textLength = bubbleText.length;
    const duration = textLength * 200;

    textInterval = setInterval(() => {
        i = i + 100;
        let progress = i/duration;
        let textToShow = Math.floor(textLength*progress);
        bubbleTextCounter = textToShow
        if (i == duration) {
            clearInterval(textInterval);
        }
    }, FRAMERATE);

    return;
  };

  const jump = (step) => {
    const start = makeObj(step, "start_");
    tween.set(start, { duration: 0 });
  };


const cycle = (step) => {
    const frames = data.frames.filter((d) => d.name === step.cycle);
    jump(step);

    if (!frames.length) {
        frameIndex = 0;
        return;
    }

    frameIndex = frames[0].index;

    let i = 0;
    cycleInterval = setInterval(() => {
        i += 1;
        if (i >= frames.length) {
        if (step.once) {
            i -= 1;
            clearInterval(cycleInterval);
        } else i = 0;
        }
        frameIndex = frames[i].index;
    }, FRAMERATE);
};

function* run() {
    for (let step of steps) {
      if (step.delay) yield pause(step.delay);
      if (cycleInterval) clearInterval(cycleInterval);

      // "globals"
      flip = step.flip;
      z = step.z;

      cycle(step);

      // do a one time transform tween
      // if (step.duration) yield textUpdate();
      if (step.duration) yield move(step);


      // repeat step
      // TODO optimize?
      if (step.loop) steps.push({ ...step });
    }
    // TODO auto finish back on idle?
}

function startClickCounter(){
  interval = 10;
  setInterval(function(){
    if(interval == 0){
      interval = 10;
    } else {
      interval = `0${interval - 1}`;
    }
  },1000)
}

const start = () => {
    if (cancelFn) cancelFn();

    const { promise, cancel } = runWithCancel(run);
    promise.then(() => {}).catch(() => {});
    return cancel;
};

onMount(() => {

    startClickCounter();

    return () => {
        if (cycleInterval) clearInterval(cycleInterval);
        if (textInterval) clearInterval(textInterval);
    };
});


      
</script>


<div bind:clientWidth={wrapper} class="{name == "floor" ? "floor sprite-wrapper" : "sprite-wrapper"}">
  {#if ["floor","cloud","land"].indexOf(name) > -1}
    <div
      class="sprite {name}"
      style="
      width: {["floor","land"].indexOf(name) ? "200vw  " : width};
      background-image: url({bgImage});
      background-size: {width};
      height: {height};
      transform: {transform};
      background-repeat: {["floor","land"].indexOf(name) ? "repeat" : "none"};
      "
    >
    </div>
  {:else}
    <div
      class="sprite"
      in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}
      style="
          background-image: url({bgImage});
          width: {width};
          background-position: {bgPos};
          background-size: {bgSize};
          transform: {transform};
          height: {height};
          z-index: {zIndex};
        "
      >
        {#if section == "aside_1"}
          <button class="aside-wrapper">
            <div class="aside-button aside-small"><span>DENY</span></div>
            <div class="aside-button" style="margin-top: 5px;"><span>ALLOW</span></div>
          </button>
        {/if}
        {#if section == "aside_2"}
          <button class="aside-wrapper">
            <div class="aside-button aside-flip"><span>BUY</span></div>
          </button>
        {/if}
    </div>
  {/if}

  {#if name == "character"}
    <div class="bubble {section}"
      style="
        transform: {transform.split("scaleX")[0]};
        margin-left: {section == "aside_1" || section == "aside_2" ? "" : width};
        margin-bottom: {`calc(${height}*.75)`};
        left: {section == "aside_1" || section == "aside_2" ? `calc(${width}/3)` : ""};
        z-index: 1000000;
      "
    >

      <span class="bubble-text {section}">
        {#each bubbleText as span, i}
          {#if section == "aside_2"}
            <span class="faded-in word">
              {#if span == "00:00:10&nbsp;"}
                00:00:{interval}&nbsp;
              {:else}
                {@html span}
              {/if}
            </span>
          {:else}
            <span class={i < bubbleTextCounter ? "faded-in word" : "word"}>{@html span}</span>
          {/if}
        {/each}
      </span>
      {#if section == "aside_1" || section == "aside_2"}
        <svg class="aside-line" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10.6067" y="23.3347" width="3" height="3" transform="rotate(-45 10.6067 23.3347)" fill="white" fill-opacity="0.5"/>
          <rect x="10.6067" y="19.092" width="3" height="3" transform="rotate(-45 10.6067 19.092)" fill="white" fill-opacity="0.5"/>
          <rect x="10.6067" y="14.8494" width="3" height="3" transform="rotate(-45 10.6067 14.8494)" fill="white" fill-opacity="0.5"/>
          <rect x="10.6067" y="10.6067" width="3" height="3" transform="rotate(-45 10.6067 10.6067)" fill="white" fill-opacity="0.5"/>
          <rect x="10.6067" y="6.36401" width="3" height="3" transform="rotate(-45 10.6067 6.36401)" fill="white" fill-opacity="0.5"/>
          <rect x="10.6067" y="2.12134" width="3" height="3" transform="rotate(-45 10.6067 2.12134)" fill="white" fill-opacity="0.5"/>
        </svg>
      {/if}
        
      <svg class="pointer-bottom {section}" width="45px" height="31px" viewBox="0 0 45 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g class="fill-here" transform="translate(-352.000000, -6100.000000)" style="--fillColor:{white};">
            <g transform="translate(347.000000, 6011.000000)">
              <polygon transform="translate(25.000000, 110.500000) rotate(245.000000) translate(-25.000000, -110.500000) " points="25 89 38 132 12 132"></polygon>
            </g>
          </g>
        </g>
      </svg>  
    </div>
  {/if}
</div>

<!-- <div class="sprite-sandbox">
    <div
    class="sprite"
    style="
        background-image: url({bgImage});
        background-position: {bgPos};
        background-size: {bgSize};
        transform: {transform};
        width: {width};
        height: {height};
        "
  />
</div> -->

<style>
    .sprite-wrapper {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
    }
    .sprite {
        position: absolute;
        bottom: 0;
        left: 0;
        transform-origin: 50% 50%;
        background-repeat: no-repeat;
        will-change: transform;
        pointer-events: none;
    }

    .aside-line {
      position: absolute;
      left: 0;
      bottom: 0;
      transform: translate(0,100%);
    }

    .bubble {
      opacity: 1;
      min-height: 23px;
      /* transition: transform .2s,opacity .2s;
      transform: scale(.6); */
      /* transform-origin: 0 100%; */
      position: absolute;
      bottom: 0;
      left: 0;
      transform-origin: 50% 50%;
      z-index: 1000;
      background-color: white;
      padding: 8px 12px;
      display: inline-block;
      max-width: 500px;
      /* left: 100%;
      bottom: 90%; */
    }

    .bubble.aside_1, .bubble.aside_2 {
      background-color: rgba(255,255,255,0);
      width: 200px;
      bottom: 30px;
    }

    .floor {
      display: block;
    }

    .floor:before {
      content: "";
      background-image: linear-gradient(right,rgba(251,215,205,0) 0%,rgba(251,215,205,1) 100%);
      display: block;
      display: none;
      height: 100%;
      width: 100px;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100000;
      pointer-events: none;
    }

    .floor:after {
      content: "";
      background-image: linear-gradient(left,rgba(251,215,205,0) 0%,rgba(251,215,205,1) 100%);
      display: block;
      height: 100%;
      width: 100px;
      position: absolute;
      right: 0;
      display: none;
      top: 0;
      z-index: 100000;
      pointer-events: none;
    }

    .bubble-text {
      line-height: 1.5;
      font-family: var(--mono);
      margin: 0 auto;
      font-size: 18px;
      color: rgba(0,0,0,.8);
    }

    .bubble-text.aside_1, .bubble-text.aside_2 {
      transform: translate(-50%,0);
      display: block;
      width: 150px;
      margin: 0;
      text-align: center;
    }

    .bubble.aside_1 span, .bubble.aside_2 span {
      color: rgba(255,255,255,.7);
    }

    .bubble .word {
      display: inline-block;
      opacity: 0;
    }

    .bubble .faded-in {
      opacity: 1;
      transition: opacity .5s;
    }

    .pointer-bottom {
      position: absolute;
      left: -25px;
      bottom: -7px;
    }
    .fill-here {
      fill: var(--fillColor);
    }

    .pointer-bottom.aside_1, .pointer-bottom.aside_2 {
      display: none;
    }

    .aside-wrapper {
      margin-top: 100%;
      width: 100%;
    }

    .aside-button {
      color: #FFF5B3;
      border: 1px solid rgba(255,226,179,.42);
      position: relative;
      text-align: center;
      border-radius: 6px;
      font-family: "CozetteVector";
      padding: 5px;
      font-size: 18px;
    }

    .aside-small {
      height: 5px;
      padding: 0;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .aside-small span {
      position: absolute;
      top: -6px;
      left: 0;
      right: 0;
      margin: 0 auto;
      text-shadow: 1px 1px 0 #000, 1px 0px 0 #000, 0px 1px 0 #000, -1px 0px 0 #000, 0px -1px 0 #000, -1px -1px 0 #000;
    }

    .aside-flip {
      transform: scaleX(-1);
    }

    .cloud {
      mix-blend-mode: soft-light;
    }
    
    button {
      background-color: initial;
      padding: 0;
      cursor: pointer;
    }

</style>