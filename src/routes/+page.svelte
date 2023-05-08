<script>
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import Meta from "$components/Meta.svelte";
	import Index from "$components/Index.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";

	export let data;

	version();

	const preloadFont = [
	];

	const { title, description, url, keywords } = copy;

	setContext("copy", copy);
	setContext("data", data.data);


	let hed = copy["title"][0]["social"];
	let dek = copy["title"][1]["social"];
</script>

<Meta {hed} {dek} {url} {preloadFont} {keywords} />
<Index />
