import React from 'react';
import { createRoot } from 'react-dom/client';
import Selectors from './selectors';

const container = document.getElementById( 'wpac-tab-selectors' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<Selectors />
	</React.StrictMode>
);
