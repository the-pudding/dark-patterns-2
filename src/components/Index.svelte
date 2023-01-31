<script>
	import { getContext } from "svelte";
	import Demo from "$components/demo/Demo.svelte";
	import WIP from "$components/helpers/WIP.svelte";
	import Story from "$components/Story.svelte";
	// import Footer from "$components/Footer.svelte";

	const copy = getContext("copy");
	// const data = getContext("data");
</script>

<!-- <WIP /> -->

<Story {copy}/>
<!-- <Demo /> -->
<!-- <Footer /> -->
