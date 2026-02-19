import adapterStatic from '@sveltejs/adapter-static';
import adapterNode from '@sveltejs/adapter-node';

const target = process.env.ADAPTER_TARGET ?? 'static';

const adapter = target === 'node'
	? adapterNode()
	: adapterStatic({
		fallback: 'index.html'
	});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter
	}
};

export default config;
