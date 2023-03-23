import cueData from "$data/cues.csv";

const clean = cueData.map(d => ({
	...d,
	key: `${d.sprite}_${d.dupe}`,
	duration: d.duration === "" ? undefined : +d.duration,
	delay: +d.delay,
	start_x: +d.start_x,
	end_x: +d.end_x,
	start_y: +d.start_y,
	end_y: +d.end_y,
	start_r: +d.start_r,
	end_r: +d.end_r,
	end_y: +d.end_y,
	flip: !!d.flip,
	loop: !!d.loop,
	once: !!d.once,
	z: +d.z,
}));

export default clean;