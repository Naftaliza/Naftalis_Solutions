import React from 'react';
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Helmet } from 'react-helmet';
import App from '@/App';

/**
 * Server entry used only at build time by tools/prerender.js.
 *
 * `renderToPipeableStream` with `onAllReady` is what makes this work: the app
 * lazy-loads every page behind a <Suspense> boundary, and plain
 * renderToString would emit the loading spinner instead of the page. onAllReady
 * waits for every boundary to resolve before we take the HTML.
 *
 * Note there is no <StrictMode> here — its double render would push each page's
 * tags onto react-helmet's stack twice.
 */
export function render(url) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		let settled = false;

		const writable = new Writable({
			write(chunk, _encoding, callback) {
				chunks.push(Buffer.from(chunk));
				callback();
			},
		});

		writable.on('finish', () => {
			if (settled) return;
			settled = true;
			// renderStatic must be read after the render completes, and it is
			// not concurrency-safe — prerender.js renders routes one at a time.
			resolve({ html: Buffer.concat(chunks).toString('utf8'), helmet: Helmet.renderStatic() });
		});

		const { pipe, abort } = renderToPipeableStream(
			<StaticRouter location={url}>
				<App />
			</StaticRouter>,
			{
				onAllReady() {
					pipe(writable);
				},
				onError(error) {
					if (settled) return;
					settled = true;
					reject(error);
				},
			},
		);

		const timer = setTimeout(() => {
			abort();
			if (!settled) {
				settled = true;
				reject(new Error(`Prerender timed out for ${url}`));
			}
		}, 20000);

		writable.on('finish', () => clearTimeout(timer));
	});
}
