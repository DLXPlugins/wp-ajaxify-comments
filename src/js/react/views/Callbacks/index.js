import React from 'react';
import { createRoot } from 'react-dom/client';
import Callbacks from './callbacks';

const container = document.getElementById( 'wpac-tab-callbacks' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<Callbacks />
	</React.StrictMode>
);
