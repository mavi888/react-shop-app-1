import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	getUserCart,
	removeCartItem,
	onSuccessBuy,
} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty } from 'antd';
import { Button } from 'antd';

function CartPage(props) {
	const dispatch = useDispatch();

	const [Total, setTotal] = useState(0);
	const [ShowTotal, setShowTotal] = useState(false);
	const [ShowSuccess, setShowSuccess] = useState(false);
	const [CartDetails, setCartDetails] = useState([]);

	useEffect(() => {
		if (props.user.userData && props.user.userData.cart) {
			if (props.user.userData.cart.length > 0) {
				setCartDetails(props.user.userData.cart);
				calculateTotal(props.user.userData.cart);
			}
		}
	}, [props.user.userData]);

	const getCartFromServer = () => {
		dispatch(getUserCart())
			.then((response) => {
				const userCart = response.payload;
				setCartDetails(userCart);
				calculateTotal(userCart);
			})
			.catch((err) => {
				alert(err);
			});
	};

	const calculateTotal = (cartDetail) => {
		let total = 0;

		cartDetail.map((item) => {
			total += parseInt(item.price, 10) * item.quantity;
		});

		setTotal(total);
		setShowTotal(true);
	};

	const removeFromCart = (productId) => {
		dispatch(removeCartItem(productId)).then((response) => {
			getCartFromServer();
		});
	};

	const payHandler = () => {
		dispatch(
			onSuccessBuy({
				cartDetail: props.user.cartDetail,
			})
		).then((response) => {
			if (response.payload.success) {
				setShowSuccess(true);
				setShowTotal(false);
			}
		});
	};

	return (
		<div style={{ width: '85%', margin: '3rem auto' }}>
			<h1>My Shopping Cart</h1>
			<div>
				<UserCardBlock products={CartDetails} removeItem={removeFromCart} />

				{ShowTotal ? (
					<div style={{ marginTop: '3rem' }}>
						<h2>Total amount: ${Total} </h2>
					</div>
				) : ShowSuccess ? (
					<Result status="success" title="Successfully Purchased Items" />
				) : (
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<br />
						<Empty description={false} />
						<p>No Items In the Cart</p>
					</div>
				)}
			</div>

			{ShowTotal && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button size="large" shape="round" type="danger" onClick={payHandler}>
						Purchase products
					</Button>
				</div>
			)}
		</div>
	);
}

export default CartPage;
