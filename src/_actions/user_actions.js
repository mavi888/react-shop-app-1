import axios from 'axios';
import {
	LOGIN_USER,
	REGISTER_USER,
	CONFIRM_USER,
	AUTH_USER,
	IS_USER_AUTH,
	LOGOUT_USER,
	ADD_TO_CART_USER,
	GET_CART_ITEMS_USER,
	REMOVE_CART_ITEM_USER,
	ON_SUCCESS_BUY_USER,
	PRODUCT_UPLOAD,
	IMAGE_UPLOAD,
	GET_PRODUCT_BY_ID,
	GET_HISTORY,
	GET_PRODUCTS,
} from './types';

import {
	SERVER_URL,
	USER_SERVER,
	STORE_SERVER,
	PRODUCT_SERVER,
} from '../components/Config.js';

import { Amplify, Auth, Storage } from 'aws-amplify';

import awsExports from './aws-config';

Amplify.configure(awsExports);

export function registerUser(dataToSubmit) {
	const request = Auth.signUp({
		username: dataToSubmit.email,
		password: dataToSubmit.password,
		attributes: {
			email: dataToSubmit.email,
			name: dataToSubmit.name,
			family_name: dataToSubmit.lastname,
		},
	}).then((user) => {
		axios.post(`${SERVER_URL}${USER_SERVER}/register`, dataToSubmit);

		return {
			success: true,
		};
	});

	return {
		type: REGISTER_USER,
		payload: request,
	};
}

export function confirmNewUser(dataToSubmit) {
	const request = Auth.confirmSignUp(
		dataToSubmit.email,
		dataToSubmit.code
	).then((res) => {
		return {
			success: true,
		};
	});

	return {
		type: CONFIRM_USER,
		payload: request,
	};
}

export function loginUser(dataToSubmit) {
	const request = Auth.signIn({
		username: dataToSubmit.email,
		password: dataToSubmit.password,
	}).then((user) => {
		return {
			loginSuccess: true,
			userId: user.username,
		};
	});

	return {
		type: LOGIN_USER,
		payload: request,
	};
}

export function auth() {
	const request = getAuthorizationHeader().then((config) => {
		return axios
			.get(`${SERVER_URL}${USER_SERVER}/auth`, config)
			.then((response) => {
				return response.data;
			});
	});

	return {
		type: AUTH_USER,
		payload: request,
	};
}

export function isUserAuth() {
	const request = Auth.currentSession()
		.then((res) => {
			return true;
		})
		.catch((err) => {
			console.log(err);
		});

	return {
		type: IS_USER_AUTH,
		payload: request,
	};
}

export function logoutUser() {
	const request = Auth.signOut().then(() => {
		return {
			success: true,
		};
	});

	return {
		type: LOGOUT_USER,
		payload: request,
	};
}

export function addToCart(_id) {
	const request = getAuthorizationHeader().then((config) => {
		return axios
			.get(`${SERVER_URL}${STORE_SERVER}/addToCart?productId=${_id}`, config)
			.then((response) => {
				return response.data;
			});
	});

	return {
		type: ADD_TO_CART_USER,
		payload: request,
	};
}

export function getUserCart() {
	const request = getAuthorizationHeader().then((config) => {
		return axios
			.get(`${SERVER_URL}${STORE_SERVER}/userCartInfo`, config)
			.then((response) => {
				if (response.data.success) {
					const cartDetail = response.data.cartDetail;
					return cartDetail;
				} else {
					throw new Error('Failed to get user cart');
				}
			});
	});

	return {
		type: GET_CART_ITEMS_USER,
		payload: request,
	};
}

export function getHistory() {
	const request = getAuthorizationHeader().then((config) => {
		return axios
			.get(`${SERVER_URL}${STORE_SERVER}/getHistory`, config)
			.then((response) => {
				if (response.data.success) {
					return response.data.history;
				} else {
					throw new Error('Failed to get user history');
				}
			});
	});

	return {
		type: GET_HISTORY,
		payload: request,
	};
}

export function removeCartItem(id) {
	const request = getAuthorizationHeader().then((config) => {
		return axios
			.get(`${SERVER_URL}${STORE_SERVER}/removeFromCart?_id=${id}`, config)
			.then((response) => {
				return response.data;
			})
			.catch((e) => {
				alert('Error removing item from cart');
			});
	});

	return {
		type: REMOVE_CART_ITEM_USER,
		payload: request,
	};
}

export function onSuccessBuy(data) {
	const request = getAuthorizationHeader().then((config) => {
		return axios
			.post(`${SERVER_URL}${STORE_SERVER}/successBuy`, data, config)
			.then((response) => response.data);
	});

	return {
		type: ON_SUCCESS_BUY_USER,
		payload: request,
	};
}

export function uploadImage(file) {
	const fileName = `uploads/${file.name}`;

	const request = Storage.put(fileName, file).then((result) => {
		return {
			image: fileName,
			success: true,
		};
	});

	return {
		type: IMAGE_UPLOAD,
		payload: request,
	};
}

export function uploadProduct(productDetail) {
	const request = getAuthorizationHeader().then((config) => {
		return axios
			.post(
				`${SERVER_URL}${PRODUCT_SERVER}/uploadProduct`,
				productDetail,
				config
			)
			.then((response) => {
				if (response.data.success) {
					return {
						success: true,
					};
				} else {
					throw new Error('Failed to upload product');
				}
			});
	});

	return {
		type: PRODUCT_UPLOAD,
		payload: request,
	};
}

export function getProductById(productId) {
	const request = axios
		.get(
			`${SERVER_URL}${PRODUCT_SERVER}/products_by_id?id=${productId}&type=single`
		)
		.then((response) => {
			return response.data[0];
		});

	return {
		type: GET_PRODUCT_BY_ID,
		payload: request,
	};
}

export function getProducts(variables) {
	const request = axios
		.post(`${SERVER_URL}${PRODUCT_SERVER}/getProducts`, variables)
		.then((response) => {
			return response.data;
		});

	return {
		type: GET_PRODUCTS,
		payload: request,
	};
}

function getAuthorizationHeader() {
	return Auth.currentSession().then((res) => {
		const token = res.getAccessToken();
		const jwtToken = token.getJwtToken();

		const config = {
			headers: { Authorization: `Bearer ${jwtToken}` },
		};

		return config;
	});
}
