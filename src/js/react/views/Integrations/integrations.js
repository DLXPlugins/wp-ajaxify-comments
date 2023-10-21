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
import Plugin from './Plugin';

const integratedPlugins = [
	{
		icon: CommentEditCoreImg,
		pluginName: 'Comment Edit Core',
		path: 'simple-comment-editing/index.php',
		installed: false,
		activated: false,
		orgUrl: 'https://wordpress.org/plugins/simple-comment-editing/',
		description: 'Allow users to edit their comments for a limited time after a user has left a comment.',
		installNonce: wpacAdminIntegrations.cecInstallNonce,
		activateNonce: wpacAdminIntegrations.cecActivateNonce,
	},
	{
		icon: ConfettiImg,
		pluginName: 'Confetti',
		path: 'confetti/confetti.php',
		installed: false,
		activated: false,
		orgUrl: 'https://wordpress.org/plugins/confetti/',
		description: 'Display a fun confetti effect when someone leaves a comment.',
		installNonce: wpacAdminIntegrations.confettiInstallNonce,
		activateNonce: wpacAdminIntegrations.confettiActivateNonce,
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
						<Plugin
							key={ plugin.path }
							{ ...plugin }
						/>
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
