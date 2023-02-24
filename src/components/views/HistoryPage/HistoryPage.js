import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getHistory } from '../../../_actions/user_actions';
import moment from 'moment';

function HistoryPage() {
	const dispatch = useDispatch();

	const [History, setHistory] = useState([]);

	useEffect(() => {
		dispatch(getHistory())
			.then((response) => {
				const history = response.payload;
				setHistory(history);
			})
			.catch((err) => {
				alert(err);
			});
	}, []);

	const formatTime = (time) => {
		const date = new Date(parseInt(time));
		const formattedDate = date.toDateString();
		return formattedDate;
	};

	return (
		<div style={{ width: '80%', margin: '3rem auto' }}>
			<div style={{ textAlign: 'center' }}>
				<h1>Purchase History</h1>
			</div>
			<br />

			<table>
				<thead>
					<tr>
						<th>Order Id</th>
						<th>Price</th>
						<th>Quantity</th>
						<th>Date of Purchase</th>
					</tr>
				</thead>

				<tbody>
					{History.map((item) => (
						<tr key={item.orderId}>
							<td>{item.orderId}</td>
							<td>{item.totalPrice}</td>
							<td>{item.totalQuantity}</td>
							<td>{formatTime(item.date)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default HistoryPage;
