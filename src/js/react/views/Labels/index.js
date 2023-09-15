import React from 'react';
import { createRoot } from 'react-dom/client';
import Labels from './labels';

const container = document.getElementById( 'wpac-tab-labels' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<Labels />
	</React.StrictMode>
);
