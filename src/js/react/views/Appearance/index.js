import React from 'react';
import { createRoot } from 'react-dom/client';
import Appearance from './appearance';

const container = document.getElementById( 'wpac-tab-appearance' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<Appearance />
	</React.StrictMode>
);
