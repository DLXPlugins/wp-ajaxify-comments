import React from 'react';
import { createRoot } from 'react-dom/client';
import Integrations from './integrations';

const container = document.getElementById( 'wpac-tab-integrations' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<Integrations />
	</React.StrictMode>
);
