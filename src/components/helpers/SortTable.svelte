<script>
	import { createEventDispatcher } from "svelte";
	import { space } from "svelte/internal";
	export let caption = "";
	export let rows = []; // [{ class, style }]
	export let columns = []; // [{ label, prop, sort = true, type = "text", dir = undefined, sortFn: undefined }];

	export let copy;

	
	const dispatch = createEventDispatcher();

	const sortFn = {
		asc: (a, b) =>
			a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN,
		desc: (a, b) =>
			a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
	};

	const onSort = ({ prop, i, same }) => {
		const dir = th[i].dir;
		const newDir = same ? dir : dir === "asc" ? "desc" : "asc";
		const customSort = th[i].sortFn;

		th.forEach((d) => (d.dir = undefined));
		th[i].dir = newDir;
		th = [...th];

		tr.sort((a, b) =>
			customSort
				? customSort(a, b, sortFn[newDir])
				: sortFn[newDir](a[prop], b[prop])
		);
		tr = [...tr];
	};

	const autoSort = () => {
		const match = th.find((d) => d.dir);
		if (match) {
			const { prop, i } = match;
			const same = true;
			onSort({ prop, i, same });
		}
	};

	$: th = columns.map((d, i) => ({ sort: true, type: "text", ...d, i }));
	$: tr = rows.map((d) => ({
		...d,
		style: d.style || "",
		class: d.class || ""
	}));
	$: autoSort(tr);

	$: companyLookup = new Map(copy.map(obj => [obj["company"], obj]));


</script>

<table>
	<caption>{caption}</caption>
	<thead>
		<tr>
			{#each th as { label, prop, type, sort, dir }, i}
				<th
					class:is-sortable={sort}
					class:is-number={type === "number"}
					class:is-asc={dir === "asc"}
					class:is-desc={dir === "desc"}
				>
					{#if sort}
						<button on:click={() => onSort({ prop, i })}>{label}</button>
					{:else}	
						<span style={i == 2 || i == 1 ? 'width: 150px' : ''}>{label}</span>
						
					{/if}
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each tr as r}
			<tr on:click={() => dispatch("chart", r)}>
				{#each columns as { prop, type }}
					<td
						style={r.style}
						class={r.class}
						class:is-number={type === "number"}
					>

					
						{#if prop == "Company"}
							{#if companyLookup.get(r[prop]).w > 350}
								<span>{r[prop]}</span>
							{:else}
								<div class="img-wrapper"><img class={companyLookup.get(r[prop]).id} alt="{r[prop]}" src="assets/{companyLookup.get(r[prop]).id}.png"></div>
							{/if}
							
						{:else if r[prop] == "FALSE"}
							<div class="x">
								<img alt="Savage Fenty" src="assets/x.png">
							</div>
						{:else if r[prop] == "TRUE"}
							<div class="x"><img alt="Savage Fenty" src="assets/check.png"></div>
						{:else}
							{@html r[prop]}
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		table-layout: auto;
		font-family: 'CozetteVector';
	}

	th.is-number,
	td.is-number {
		text-align: right;
	}

	th span {
    	display: block;
	}

	th,
	td {
		vertical-align: bottom;
		line-height: 1.2;
		font-weight: normal;
	}

	td {
		vertical-align: middle;
	}

	thead {
		background-color: rgba(0,0,0,.1);
		font-family: 'CozetteVector';
	}

	td {
		border-top: 1px solid currentColor;
	}

	.img-wrapper {
		max-width: 150px;
		padding-right: 10px;
	}

	.flex {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	img {
		width: 100%;
		margin: 0;
	}

	th button {
		font-weight: inherit;
		color: inherit;
		padding: 0;
		margin: 0;
		background: transparent;
		border: none;
		border-radius: 0;
		appearance: none;
		font-family: 'CozetteVector';
		font-size: 21px;
	}

	th {
		font-size: 18px;
		padding-right: 10px;
	}

	th.is-sortable button:after {
		content: "–";
		display: inline-block;
		text-align: center;
		margin-left: 0.5em;
		font-family: monospace;
		vertical-align: middle;
	}

	th.is-sortable.is-asc button:after {
		content: "▲";
		visibility: visible;
	}

	th.is-sortable.is-desc button:after {
		content: "▼";
		visibility: visible;
	}

	tr {
		cursor: pointer;
	}
	.x {
		max-width: 30px;
	}

</style>
