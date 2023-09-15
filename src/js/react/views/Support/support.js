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

const SupportScreen = (props) => {


	const getCommentEditingHeader = () => {
		return (
			<>
				<h2>
					{__('Support', 'wp-ajaxify-comments')}
				</h2>
				<p className="description">
					{__(
						'Get help for the plugin. Please note that this is a free plugin supported by volunteers. Please be patient and polite when asking for help.',
						'wp-ajaxify-comments'
					)}
				</p>
			</>
		);
	};

	return (
		<>
			<div className="ajaxify-admin-panel-area">
				{getCommentEditingHeader()}
				<div className="ajaxify-admin-content-support-row">
					<h3 className="ajaxify-admin-content-subheading">
						{__('Documentation and Overview', 'wp-ajaxify-comments')}
					</h3>
					<p className="description">
						{__(
							'The documentation for Highlight and Share is designed to get you up and running fast.',
							'wp-ajaxify-comments'
						)}
					</p>
					<div className="ajaxify-admin-component-row ajaxify-admin-component-row-button">
						<Button
							className="ajaxify-button ajaxify__btn-secondary"
							href="https://docs.dlxplugins.com/v/wp-ajaxify-comments/"
							target="_blank"
							rel="noopener noreferrer"
							icon={<Bookmark />}
						>
							{__('Visit the Documentation', 'wp-ajaxify-comments')}
						</Button>
					</div>
				</div>
				<div className="ajaxify-admin-content-support-row">
					<h3 className="ajaxify-admin-content-subheading">
						{__('Support and Help', 'wp-ajaxify-comments')}
					</h3>
					<p className="description">
						{__(
							'Get the help you need, either through the public support forums or privately through a support ticket.',
							'wp-ajaxify-comments'
						)}
					</p>
					<div className="ajaxify-admin-component-row ajaxify-admin-component-row-button">
						<Button
							className="ajaxify-button ajaxify__btn-secondary"
							href="https://wordpress.org/support/plugin/wp-ajaxify-comments/"
							target="_blank"
							rel="noopener noreferrer"
							icon={<Users2 />}
						>
							{__('Visit the Support Forums', 'wp-ajaxify-comments')}
						</Button>
						<Button
							className="ajaxify-button ajaxify__btn-secondary"
							href="https://dlxplugins.com/support/"
							target="_blank"
							rel="noopener noreferrer"
							icon={<Mail />}
						>
							{__('Use the Support Form', 'wp-ajaxify-comments')}
						</Button>
					</div>
				</div>
				<div className="ajaxify-admin-content-support-row">
					<h3 className="ajaxify-admin-content-subheading">
						{__('Please Leave a Star Rating', 'wp-ajaxify-comments')}
					</h3>
					<p className="description">
						{__(
							'Please take a moment to rate Ajaxify Comments on WordPress.org. Your ratings help others decide whether to use this plugin. Ratings also help us to continue to improve and spread awareness of the plugin.',
							'wp-ajaxify-comments'
						)}
					</p>
					<div className="ajaxify-admin-component-row ajaxify-admin-component-row-button">
						<Button
							className="ajaxify-button ajaxify__btn-secondary ajaxify-button-heart"
							href="https://wordpress.org/support/plugin/wp-ajaxify-comments/"
							target="_blank"
							rel="noopener noreferrer"
							icon={<HeartHandshake />}
						>
							{__('Please Rate Ajaxify Comments', 'wp-ajaxify-comments')}
						</Button>
					</div>
				</div>
				<div className="ajaxify-admin-content-support-row">
					<h3 className="ajaxify-admin-content-subheading">
						{__('More From DLX Plugins', 'wp-ajaxify-comments')}
					</h3>
					<p className="description">
						{__(
							'Check out more plugins and plugin tutorials from DLX Plugins.',
							'wp-ajaxify-comments'
						)}
					</p>
					<div className="ajaxify-admin-component-row ajaxify-admin-component-row-button">
						<Button
							className="ajaxify-button ajaxify__btn-secondary ajaxify-button-zap"
							href="https://wordpress.org/support/plugin/wp-ajaxify-comments/"
							target="_blank"
							rel="noopener noreferrer"
							icon={<PlugZap />}
						>
							{__('View More Plugins', 'wp-ajaxify-comments')}
						</Button>
						<Button
							className="ajaxify-button ajaxify__btn-secondary"
							href="https://dlxplugins.com/support/"
							target="_blank"
							rel="noopener noreferrer"
							icon={<GraduationCap />}
						>
							{__('View Plugin Tutorials', 'wp-ajaxify-comments')}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
export default SupportScreen;
