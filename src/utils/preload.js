import loadImage from "./loadImage";

export default async function preload(cueData) {
	const all = cueData.map(d => d.sprite).filter(d => d);
	let sprites = [...new Set(all)];
	console.log(sprites)

	for (let sprite of sprites) {
		await loadImage(`assets/${sprite}.png`);
	}

	return true;
};