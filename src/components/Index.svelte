<script>
	import { onMount, setContext, getContext } from "svelte";
	import { groups, format } from "d3";

	import Demo from "$components/demo/Demo.svelte";
	import WIP from "$components/helpers/WIP.svelte";
	import Story from "$components/Story.svelte";
	import spriteData from "$data/sprites.csv";
	import Sprite from "./Sprite.svelte";

	// import Footer from "$components/Footer.svelte";

	const copy = getContext("copy");

	let spriteDataLoaded = false;
	let spriteDataGrouped;
	let sesameSprites;
	let nameLookup = {
		coin:"character",
		idle:"character",
		jump:"character",
		shock:"character",
		walk:"character",
		win:"character",
		"Big-Boss":"Big-Boss",
		floor:"floor",
		land:"land",
		cloud:"cloud"
	}

	let sizeLookup = {
		"character": 128,
		"Big-Boss":256,
		"floor":304,
		"land":304,
		"cloud":240
	}

	let rowLookup = {
		"character": [9,9],
		"Big-Boss":[3,3],
		"floor":[1,1],
		"land":[1,1],
		"cloud":[1,1]
	}


	onMount(() => {
        spriteData.forEach(d => {
			d.name = nameLookup[d.id.replace(/[0-9]/g, '')];
		});

		let spriteDataSorted = spriteData.sort((a,b) => {
			let countA = a["id"].replace(/\D/g,'');
			let countB = b["id"].replace(/\D/g,'');

			return countA - countB;
		})

		spriteDataGrouped = groups(spriteDataSorted, (d) => d.name);
		spriteDataLoaded = true;


		sesameSprites = spriteDataGrouped.map(d => {
			return {
				id: d[0],
				size: sizeLookup[d[0]],
				rows: rowLookup[d[0]][0],
				cols: rowLookup[d[0]][1],
				frames: d[1].map((d,i) => {
					return {
						index: i,
						x:d.x,
						y:d.y,
						name:d.id.replace(/[0-9]/g, '')
					}
				})
			}
		})

		console.log(sesameSprites)
    });

	// const data = getContext("data");
</script>

<!-- <WIP /> -->
{#if spriteDataLoaded}
	<Story {copy} {sesameSprites}/>
{/if}
<!-- <Demo /> -->
<!-- <Footer /> -->
