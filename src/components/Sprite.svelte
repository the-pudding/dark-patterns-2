<script>
    import { base } from "$app/paths";
    import { onMount, getContext } from "svelte";
    import { tweened } from "svelte/motion";
    import runWithCancel from "$utils/runWithCancel.js";
    export let name;
    export let steps;
    export let data;
    export let id;
    const { scale, BASE } = getContext("Game");
    const FRAMERATE = 100;
    let tween = tweened({ x: 10, y: 0, r: 0 });
    let cycleInterval;
    let frameIndex = 0;
    let flip;
    let z;
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
    $: cancelFn = start(id);
    $: frame = data.frames.find((d) => d.index === frameIndex);
    $: x = `${$tween.x * $scale * BASE}px`;
    $: y = `${$tween.y * $scale * BASE * -1}px`;
    $: s = flip ? -1 : 1;
    $: bgImage = `${base}/assets/sprites2x/${name}@2x.png`;
    $: bgPos = `${$scale * frame.x * -1}px ${$scale * frame.y * -1}px`;
    $: bgSize = `calc(100% * ${data.cols}) calc(100% * ${data.rows})`;
    $: transform = `translate3d(${x}, ${y}, 0) scaleX(${s})`;
    $: width = `${data.size * $scale}px`;
    $: height = `${data.size * $scale}px`;
    $: zIndex = z || 1;
    onMount(() => {
      return () => {
        if (cycleInterval) clearInterval(cycleInterval);
      };
    });
  </script>
  
  <div
    style="
              background-image: url({bgImage});
              background-position: {bgPos};
            background-size: {bgSize};
            transform: {transform};
            width: {width};
            height: {height};
            z-index: {zIndex};"
  />
  
  <style>
    div {
      position: absolute;
      bottom: 0;
      left: 0;
      transform-origin: 50% 50%;
      background-repeat: no-repeat;
      will-change: transform;
      pointer-events: none;
    }
  </style>
  