<script>
	    import Tip from "$components/helpers/Tip.svelte"

</script>

<header>
	<div class="tip-top">
		<Tip href={"https://donate.stripe.com/3cs2bw4lte8wgmc5kn"} />
	</div>
	<div class="wordmark">
		<a href="/" aria-label="The Pudding">
			The Pudding
		</a>
		<p class="workmark-sub">PRESENTS</p>
	</div>
</header>

<style>
    .tip-top {
        position: absolute;
        right: 1rem;
        left: auto;
        top: 1rem;
        z-index: 10000;
    }
	header {
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		pointer-events: all;
    	z-index: 1000000;
	}

	.wordmark {
		max-width: 10em;
		margin: 0 auto;
		font-size: 36px;
		padding: 1em 0;
		font-family: var(--mono);
		opacity: .6;
	}

	.workmark-sub {
		font-size: 16px;
		font-family: var(--mono);
		letter-spacing: 2px;
		text-align: center;
		margin: 0 auto;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

	}

	.wordmark a {
		border: none;
		display: block;
		color: black;
		text-align: center;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-size: 28px;
	}

	.wordmark a:hover {
		background-color: transparent;
	}

	:global(.wordmark svg path) {
		fill: currentColor;
	}
</style>
