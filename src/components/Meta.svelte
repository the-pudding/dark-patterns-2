<script>
	export let hed = "Title TK";
	export let dek = "Description TK";
	let url = "https://pudding.cool/2023/05/dark-patterns";
</script>

<svelte:head>
	<title>{hed}</title>
	<meta name="description" content={dek} />
	<meta name="author" content="The Pudding" />
	<meta name="news_keywords" content="dark patterns,design,subscription,ui" />

	<meta property="og:title" content={hed} />
	<meta property="og:site_name" content="The Pudding" />
	<meta property="og:url" content={url} />
	<meta property="og:description" content={dek} />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="en_US" />

	<meta property="og:image" content="{url}/assets/social-facebook.jpg" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="https://pudding.cool" />
	<meta name="twitter:creator" content="@puddingviz" />
	<meta name="twitter:title" content={hed} />
	<meta name="twitter:description" content={dek} />
	<meta name="twitter:image:src" content="{url}/assets/social-twitter.jpg" />

	<meta name="robots" content="max-image-preview:large" />

	<link rel="canonical" href="{url}/" />

</svelte:head>
