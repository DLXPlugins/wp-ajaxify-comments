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
			<div className="ajaxify-admin-panel-area">
				<>
					<h2>
						{ __( 'Featured Pro Plugins', 'wp-ajaxify-comments' ) }
					</h2>
					<p className="description">
						{ __(
							'These pro/premium plugins are designed to work with Ajaxify Comments.',
							'wp-ajaxify-comments',
						) }
					</p>
				</>
				<div className="ajaxify-plugin-integration">
					<div className="ajaxify-plugin-integration-info">
						<div className="ajaxify-plugin-integration-icon">
							<img src={ CommentEditCoreImg } alt={ __( 'Comment Edit Pro', 'wp-ajaxify-comments' ) } />
						</div>
						<div className="ajaxify-plugin-integration-meta">
							<h3>
								<a href="https://dlxplugins.com/plugins/comment-edit-pro">{ __( 'Comment Edit Pro', 'wp-ajaxify-comments' ) }</a></h3>
							<p className="description">
								{ __( 'Comment Edit Pro extends basic comment editing with frontend moderation, webhooks, Slack integration, comment shortcuts, and much, much more.', 'wp-ajaxify-comments' ) }
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default IntegrationsScreen;
