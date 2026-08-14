import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';

const container = document.getElementById('root');

const tree = (
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);

// Production HTML is prerendered (tools/prerender.js), so attach to the
// existing markup instead of throwing it away and painting from scratch.
// In dev the root is empty, so fall back to a fresh render.
if (container.hasChildNodes()) {
	ReactDOM.hydrateRoot(container, tree);
} else {
	ReactDOM.createRoot(container).render(tree);
}
