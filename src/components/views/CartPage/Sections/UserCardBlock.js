import React from 'react';
import CloudFrontImage from '../../../utils/CloudFrontImage';

function UserCardBlock(props) {
	const renderItems = () =>
		props.products &&
		props.products.map((product) => (
			<tr key={product.productId}>
				<td>
					<CloudFrontImage
						image={product.images[0]}
						style={{ width: '70px' }}
						alt={`product`}
					/>
				</td>
				<td>{product.title}</td>
				<td>{product.quantity}</td>
				<td>$ {product.price}</td>
				<td>
					<button onClick={() => props.removeItem(product.productId)}>
						Remove{' '}
					</button>{' '}
				</td>
			</tr>
		));

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Product</th>
						<th>Product Title</th>
						<th>Product Quantity</th>
						<th>Product Price</th>
						<th>Remove from Cart</th>
					</tr>
				</thead>
				<tbody>{renderItems()}</tbody>
			</table>
		</div>
	);
}

export default UserCardBlock;
