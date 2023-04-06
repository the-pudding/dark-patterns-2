<script>
	import wordmark from "$svg/wordmark.svg";
</script>

<header>
	<div class="wordmark">
		<a href="/" aria-label="The Pudding">
			The Pudding
		</a>
		<p class="workmark-sub">PRESENTS</p>
	</div>
</header>

<style>

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
