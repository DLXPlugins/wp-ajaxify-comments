import React from 'react';
import { createRoot } from 'react-dom/client';
import { Popover, SlotFillProvider } from '@wordpress/components';
import LazyLoad from './lazy-load';

const container = document.getElementById( 'wpac-tab-lazy-load' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<SlotFillProvider>
			<LazyLoad />
			<Popover.Slot />
		</SlotFillProvider>
	</React.StrictMode>
);
