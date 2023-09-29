import React from 'react';
import { createRoot } from 'react-dom/client';
import LazyLoad from './lazy-load';

const container = document.getElementById( 'wpac-tab-lazy-load' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<LazyLoad />
	</React.StrictMode>
);
