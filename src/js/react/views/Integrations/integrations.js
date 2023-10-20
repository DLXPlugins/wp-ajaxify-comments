/* eslint-disable no-unused-vars */
import React, { useState, Suspense, useEffect } from 'react';
import { useForm, Controller, useWatch, useFormState } from 'react-hook-form';
import classNames from 'classnames';
import { useAsyncResource } from 'use-async-resource';
import { __, sprintf } from '@wordpress/i18n';
import BeatLoader from 'react-spinners/BeatLoader';

import {
	TextControl,
	Button,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { Bookmark, Mail, Users2, GraduationCap, PlugZap, HeartHandshake } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import ConfettiImg from './img/confetti-256x256.png';
import CommentEditCoreImg from './img/cec-256x256.png';

const integratedPlugins = [
	{
		icon: CommentEditCoreImg,
		name: 'Comment Edit Core',
		slug: 'simple-comment-editing',
		installed: false,
		activated: false,
		orgUrl: 'https://wordpress.org/plugins/simple-comment-editing/',
		description: 'Allow users to edit their comments for a limited time after a user has left a comment.',
		installUrl: wpacAdminIntegrations.cecInstallUrl
	},
	{
		icon: ConfettiImg,
		name: 'Confetti',
		slug: 'confetti',
		installed: false,
		activated: false,
		orgUrl: 'https://wordpress.org/plugins/confetti/',
		description: 'Display a fun confetti effect when someone leaves a comment.',
		installUrl: wpacAdminIntegrations.confettiInstallUrl
	},
];

const IntegrationsScreen = ( props ) => {
	const getCommentEditingHeader = () => {
		return (
			<>
				<h2>
					{ __( 'Plugin Integrations and Compatibility', 'wp-ajaxify-comments' ) }
				</h2>
				<p className="description">
					{ __(
						'The following plugins can be integrated directly with Ajaxify Comments.',
						'wp-ajaxify-comments',
					) }
				</p>
			</>
		);
	};

	const getPlugins = () => {
		return (
			<div className="ajaxify-plugin-integrations-wrapper">
				{ integratedPlugins.map( ( plugin ) => {
					return (
						<div key={ plugin.slug } className="ajaxify-plugin-integration">
							<div className="ajaxify-plugin-integration-info">
								<div className="ajaxify-plugin-integration-icon">
									<img src={ plugin.icon } alt={ plugin.name } />
								</div>
								<div className="ajaxify-plugin-integration-meta">
									<h3>{ plugin.name }</h3>
									<p className="description">
										{ plugin.description }
									</p>
								</div>
							</div>
							<div className="ajaxify-plugin-integration-actions">
								<div className="ajaxify-plugin-integration-status">
									Status: { plugin.installed ? 'Installed' : 'Not Installed' }
								</div>
								<div className="ajaxify-plugin-integration-button">
									<Button
										variant="primary"
										onClick={ ( e ) => {
											e.preventDefault();
											// Perform fetch request.
											const response = fetch( plugin.installUrl, {
												method: 'GET',
											} );
											// Handle response.
											response.then( ( response ) => {
												// Check if the response is ok.
												if ( response.ok ) {
													// Reload the page.
													console.log( response );
												}
											} );
										} }
										href={ plugin.installUrl }
									>
										{ __( 'Install', 'wp-ajaxify-comments' ) }
									</Button>
								</div>
							</div>
						</div>
					);
				} ) }
			</div>
		);
	};

	return (
		<>
			<div className="ajaxify-admin-panel-area">
				{ getCommentEditingHeader() }
				{ getPlugins() }
			</div>
		</>
	);
};
export default IntegrationsScreen;
