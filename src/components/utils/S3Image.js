import React from 'react';

import { Amplify } from 'aws-amplify';
import { AmplifyS3Image } from '@aws-amplify/ui-react/legacy';
import awsconfig from '../../_actions/aws-config';

Amplify.configure(awsconfig);

function S3Image(props) {
	return (
		<AmplifyS3Image imgKey={props.image} style={props.style} alt={props.alt} />
	);
}

export default S3Image;
