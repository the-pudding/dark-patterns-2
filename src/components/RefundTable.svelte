<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	import data from "$data/refund.csv";

	export let copy;

	let columns = Object.keys(data[0]).map(d => {
		return {label: d, prop:d, type:"text", sort:false};
	})
	let rows = data.map(d => {
		return d
	})	
</script>

<section class="demo-table">
	<SortTable {rows} {columns} {copy}/>
</section>

<style>
	.demo-table {
		margin-bottom: 150px;
		margin-top: 50px;
	}
</style>
