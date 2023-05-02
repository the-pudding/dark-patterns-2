<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	import data from "$data/refund.csv";

	export let copy;
	export let blockId;

	let columns = Object.keys(data[0]).map(d => {
		return {label: d, prop:d, type:"text", sort:false};
	})
	let rows = data.map(d => {
		return d
	})	
</script>

<section class="demo-table">
	<SortTable {rows} {columns} {copy} {blockId}/>
</section>

<style>
	.demo-table {
		margin-bottom: 100px;
		margin-top: 50px;
	}
</style>
