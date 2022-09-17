/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'react-toastify';
// constants
import { CONTRACT } from '../../../constants';
// models
import { CancelOrderInput, OrderResponseAPI, Signature } from 'models';
// abi
import ContractMetaSpacecyExchange from 'abis/MetaSpacecyExchange.json';
// api
import orderApi from 'apis/orderApi';
// hooks
import { getWeb3Contract } from 'hooks';

export const cancelOrder = (data: CancelOrderInput) => async () => {
	const { chainId, itemId, makerAddress, orderMaker, setLoading, refetchApi, collectionId } =
		data;

	console.log('data CancelOrderInput', data);

	try {
		// contract MetaSpacecyExchange
		const contractMetaSpacecyExchange = getWeb3Contract(
			ContractMetaSpacecyExchange.abi,
			CONTRACT[chainId].MetaSpacecyExchange
		);

		const paramsCancelOrder = Object.values(setupCancelOrder(chainId, orderMaker));
		console.log('paramsCancelOrder', paramsCancelOrder);

		// cancel order!
		let tx: string = '';
		await contractMetaSpacecyExchange.methods
			.cancelOrder_(...paramsCancelOrder)
			.send({ from: makerAddress })
			.then(function (result: any) {
				console.log('cancelOrder_ result', result);
				tx = result.transactionHash ?? '';
			});

		// call api delete order on database
		const deleteData = {
			collectionId,
			orderId: orderMaker.orderId ?? orderMaker._id,
			type: orderMaker.type,
			transactionHash: tx,
		};

		await orderApi.deleteOrder(deleteData);

		toast.success('Cancel success!!');
		setLoading(false);
		refetchApi();
	} catch (error) {
		console.log(error);
		setLoading(false);
	}
};

const setupCancelOrder = (chainId: number, orderMaker: OrderResponseAPI) => {
	const addrs: string[] = [
		CONTRACT[chainId].MetaSpacecyExchange,
		orderMaker.maker,
		orderMaker.taker,
		orderMaker.feeRecipient,
		orderMaker.target,
		orderMaker.staticTarget,
		orderMaker.paymentToken,
	];

	const uints: string[] = [
		orderMaker.makerRelayerFee,
		orderMaker.takerRelayerFee,
		orderMaker.makerProtocolFee,
		orderMaker.takerProtocolFee,
		orderMaker.basePrice,
		orderMaker.extra,
		orderMaker.listingTime,
		orderMaker.expirationTime,
		orderMaker.salt,
	];

	const result: any = {
		addrs,
		uints,
		feeMethod: orderMaker.feeMethod,
		side: orderMaker.side,
		saleKind: orderMaker.saleKind,
		howToCall: orderMaker.howToCall,
		callData: orderMaker.callData,
		replacementPattern: orderMaker.replacementPattern,
		staticExtradata: orderMaker.staticExtraData, // contract sai camel case
		v: orderMaker.v,
		rs: ['0x' + orderMaker.r, '0x' + orderMaker.s],
	};

	return result;
};
