<script>
import { base, assets } from "$app/paths";
import { onMount, getContext } from "svelte";
import { tweened } from "svelte/motion";
import runWithCancel from "$utils/runWithCancel.js";
import { fade } from "svelte/transition";

export let steps;
export let name;
export let data;
export let id;
export let text;

const { scale, BASE } = getContext("Game");


$: console.log("base",base, "assets", assets)

// let scale = 1.2;
// let BASE = 32*1.2;
let white = "#FFFFFF";

const FRAMERATE = 100;
let tween = tweened({ x: 10, y: 0, r: 0 });
let cycleInterval;
let textInterval;
let frameIndex = 0;
let flip;
let bubbleTextCounter;
let z;

$: bubbleText = text.split(" ").map(d => {
  return d + "&nbsp;";
})

$: bubbleText, bubbleTextCounter = 0;

$: text, textUpdate();

$: cancelFn = start(id);



$: frame = data.frames.find((d) => d.index === frameIndex);

$: x = `${$tween.x * $scale * BASE}px`;
$: y = `${$tween.y * $scale * BASE * -1}px`;
$: s = flip ? -1 : 1;

$: bgImage = `${base}/assets/${name}.png`;
$: bgPos = `${$scale * frame.x * -1}px ${$scale * frame.y * -1}px`;
$: bgSize = `calc(100% * ${data.cols}) calc(100% * ${data.rows})`;
$: transform = `translate3d(${x}, ${y}, 0) scaleX(${s})`;
$: width = `${data.size * $scale}px`;
$: height = `${data.size * $scale}px`;
$: zIndex = z || 1;

// function start(frames) {
//     let i = 0;
//     setInterval(() => {
//         i += 1;
//         if (i >= frames.length) {
//             i = 0;
//         }
//         frameIndex = i//frames[i].index;
//         },
//     75);
// }

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
    console.log(textLength)
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

const start = () => {
    if (cancelFn) cancelFn();

    const { promise, cancel } = runWithCancel(run);
    promise.then(() => {}).catch(() => {});
    return cancel;
};

onMount(() => {
    return () => {
        if (cycleInterval) clearInterval(cycleInterval);
        if (textInterval) clearInterval(textInterval);
    };
});


// onMount(() => {
//     cycle(step);
//     // start(spriteDataGrouped[image][1])
//     tween.set({x: 200, y: 0, r:0});
// })

// background-position: {bgPos};
//           background-size: {bgSize};
//           transform: {transform};

//      background-position: {bgPos};

</script>


<div class="{name == "floor" ? "floor sprite-wrapper" : "sprite-wrapper"}">
  {#if name == "floor"}
    <div
      class="sprite floor"
      style="
      background-image: url({bgImage});
      width: 200vw;
      background-size: {width};
      transform: {transform};
      height: {height};
      background-repeat: repeat;
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
    </div>
  {/if}

  {#if name == "character"}
    <div class="bubble"
      style="
        transform: {transform};
        margin-left: {width};
        margin-bottom: calc({height}*.75);
        z-index: 1000000;
      "
    >
      <span class="bubble-text">
        {#each bubbleText as span, i}
          <span class={i < bubbleTextCounter ? "faded-in word" : "word"}>{@html span}</span>
        {/each}
      </span>
      <svg class="pointer-bottom" width="45px" height="31px" viewBox="0 0 45 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
</style>