import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';

import { Row, Col } from 'antd';
import ProductInfo from './Sections/ProductInfo';
import {
	addToCart,
	getProductById,
	isUserAuth,
} from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import { IMAGE_PATH } from '../../Config';

function DetailProductPage(props) {
	const dispatch = useDispatch();

	const productId = props.match.params.productId;
	const [Product, setProduct] = useState([]);
	const [Images, setImages] = useState([]);
	const [UserAuth, setUserAuth] = useState(false);

	useEffect(() => {
		dispatch(getProductById(productId)).then((response) => {
			setProduct(response.payload);

			const productImages = response.payload.images;
			if (productImages && productImages.length > 0) {
				productImages &&
					productImages.map((item) => {
						const imageURL = `https://${process.env.REACT_APP_DISTRIBUTION_NAME}${IMAGE_PATH}${item}`;

						const img = {
							original: imageURL,
							thumbnail: imageURL,
						};

						setImages([...Images, img]);
					});
			}
		});

		dispatch(isUserAuth()).then((response) => {
			if (response.payload === undefined) {
				setUserAuth(false);
			} else {
				setUserAuth(true);
			}
		});
	}, []);

	const addToCartHandler = (productId, title, image, price) => {
		dispatch(addToCart(productId, title, image, price));
	};

	return (
		<div className="postPage" style={{ width: '100%', padding: '3rem 4rem' }}>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<h1>{Product.title}</h1>
			</div>

			<br />

			<Row gutter={[16, 16]}>
				<Col lg={12} xs={24}>
					<ImageGallery items={Images} />
				</Col>
				<Col lg={12} xs={24}>
					<ProductInfo
						addToCart={addToCartHandler}
						detail={Product}
						isUserAuth={UserAuth}
					/>
				</Col>
			</Row>
		</div>
	);
}

export default DetailProductPage;
