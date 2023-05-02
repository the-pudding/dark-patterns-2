<script>
	export let options = [];
	export let legend = "";
	export let legendPosition = "top";
	export let labelClass = "";
	export let disabled = false;
	export let binded;
	export let selectedCompany;

	//let value = options.length ? options[0].slug : "";
	let value = selectedCompany ? selectedCompany : options[0].value;

	const id = `legend-${Math.floor(Math.random() * 1000000)}`;
	const makeSlug = (str = "") => `${str}`.toLowerCase().replace(/\W/g, "");

	$: optionsWithSlug = options.map((d) => ({
		...d,
		label: d.label,
		val: d.value,
		slug: makeSlug(d.slug)
	}));
	$: isTop = legendPosition === "top";

	$: binded = value;

</script>

<div class="button-set {options.length} {options.length < 2 ? 'hide' : ''}">
	<div
		id={`group-${id}`}
		class="group"
		class:is-top={isTop}
		role="radiogroup"
		aria-labelledby={`label-${id}`}
	>
		{#if legend}<div class="legend" id="legend-{id}">{legend}</div>{/if}
		<div class="options">
			{#each optionsWithSlug as option}
				<div class="option">
					<input
						type="radio"
						id={`${id}-${option.slug}`}
						name="name-{id}"
						class="sr-only"
						value={option.value}
						{disabled}
						bind:group={value}
					/>
					<label class="option {option.value == selectedCompany ? 'selected' : ''} {labelClass}" for={`${id}-${option.slug}`}>
						{option.label || option.value}
					</label>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.button-set {
		display: inline-block;
		margin-bottom: 4px;
	}

	.hide {
		opacity: 1;
	}

	.group {
		display: flex;
		align-items: flex-start;
	}

	.group.is-top {
		flex-direction: column;
	}

	.is-top .legend {
		padding-bottom: 0.5em;
		padding-right: 0;
		margin: 0;
	}

	.legend {
		padding-right: 0.5em;
		font-size: 1em;
		text-transform: uppercase;
		font-size: 12px;
		letter-spacing: 1px;
	}

	.options {
		display: flex;
	}

	label {
		appearance: none;
		user-select: none;
		line-height: 1;
		margin: 0;
		border-radius: 0;
		outline: none;
		cursor: pointer;
		font-family: inherit;
		font-size: 1em;
		display: inline-block;
		font-family: 'CozetteVector';
		color: rgba(0,0,0,.5);
        font-size: 18px;
		margin-right: 25px;
	}

	.option + .option label {
		border-left-width: 0;
	}

	.option:first-of-type label {
		border-radius: 4px 0 0 4px;
	}

	.option:last-of-type label {
		border-radius: 0 4px 4px 0;
	}

	.option + .option > label {
		border-left-width: 0;
	}

	input[type="radio"]:checked + label,
	input[type="radio"]:checked:hover + label {
	}



	input[type="radio"]:hover + label {
		color: rgba(0,0,0,.5);
	}

	input[type="radio"]:focus + label {
		display: block;
		box-shadow: 0 0 4px 0 var(--color-focus);
	}

	input[type="radio"]:disabled + label {
		color: var(--color-gray-700);
		background: var(--color-gray-500);
		cursor: not-allowed;
	}

	.selected {
		color: rgba(0,0,0,1);
		text-decoration: underline;
        text-decoration-color: rgba(0,0,0,.3);
	}
</style>
