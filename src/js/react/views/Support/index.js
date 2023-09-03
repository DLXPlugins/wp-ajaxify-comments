import React from 'react';
import { createRoot } from 'react-dom/client';
import Support from './support';

const container = document.getElementById( 'wpac-tab-support' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<Support />
	</React.StrictMode>
);
