import loadImage from "./loadImage";

export default async function preload(cueData) {
	const all = cueData.map(d => d.sprite).filter(d => d);
	const sprites = [...new Set(all)];

	for (let sprite of sprites) {
		await loadImage(`assets/${sprite}.png`);
	}
};