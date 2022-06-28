import React from 'react'

import { IMAGE_PATH } from '../Config.js';

function CloudFrontImage(props) {

    const buildImagePath = (image) => {
        const imageURL = `https://${process.env.REACT_APP_DISTRIBUTION_NAME}${IMAGE_PATH}${image}`
        return imageURL
    }

    return (
        <img src={buildImagePath(props.image)} alt={props.alt} style={props.style}/>  
    )
}

export default CloudFrontImage
