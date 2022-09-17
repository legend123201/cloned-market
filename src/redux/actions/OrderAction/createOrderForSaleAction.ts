/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'react-toastify';
// constant
import { CONTRACT, ORDER_CONFIGURATION, ORDER_TYPE } from '../../../constants';
// utils
import { BigNumber } from 'ethers';
import { randomBytes } from '@ethersproject/random';
import {
	isNativeToken,
	encodeFunctionCall,
	erc20function,
	parseUnits,
	ValidateOrder,
	isNullAddress,
	avoidFloatingPoint,
} from 'utils';
// api
import orderApi from 'apis/orderApi';
// models
import {
	SetupOrderForSaleInput,
	Order,
	SignatureRSV,
	ApproveRoyaltiesFeeForSellInput,
	HashOrderAndSignForSellInput,
} from 'models';

const { signOrder } = ValidateOrder();

export function CreateOrderForSaleAction() {
	// approve token (coin) => "return" means succeed or not.
	const ApproveRoyaltiesFee = async (data: ApproveRoyaltiesFeeForSellInput): Promise<boolean> => {
		const { royalties, startPrice, paymentToken, chainId, userAddress } = data;

		console.log('data ApproveRoyaltiesFee', data);

		try {
			// ==============================================================ORDER SELL APPROVE ROYALTIES FEE===========================================================================//

			//============CHECK IS NATIVE COIN===============//
			if (!isNativeToken(paymentToken)) {
				const royaltiesFee: number = avoidFloatingPoint((royalties / 100) * startPrice);

				const royaltiesFeeToWei: BigNumber = await erc20function().changeTokenToWei(
					paymentToken,
					royaltiesFee
				);

				await erc20function().increaseAmountAllowance(
					paymentToken,
					royaltiesFeeToWei,
					userAddress,
					CONTRACT[chainId].MetaSpacecyTokenTransferProxy
				);
			}

			return true;
		} catch (error) {
			toast.error('Some error occur when approving royalties fee!');
			console.log(error);
			return false;
		}
	};

	// hash the order and sign => "return" means succeed or not.
	const HashOrderAndSign = async (data: HashOrderAndSignForSellInput): Promise<boolean> => {
		const {
			chainId,
			userAddress,
			paymentToken,
			feeMethod,
			startPrice,
			endPrice,
			quantity,
			itemTokenId,
			itemStandard,
			collectionAddress,
			collectionOwner,
			royalties,
			web3,
			startTime,
			endTime,
			saleKind,
			itemId,
			collectionId,
		} = data;

		try {
			// ===================================================================SETUP ORDER DATA==============================================================================//
			const order: Order = await setupOrderForSale({
				chainId,
				userAddress,
				paymentToken,
				feeMethod,
				startPrice,
				endPrice,
				quantity,
				itemTokenId,
				itemStandard,
				collectionAddress,
				collectionOwner,
				royalties,
				web3,
				startTime,
				endTime,
				saleKind,
			});

			console.log('Order here', order);

			// ==============================================================GET SIGNATURE HASH==================================================================================//
			const signatureHash: string = await signOrder(order, chainId, web3);

			// ==============================================================GET SIGNATURE RSV==================================================================================//
			const signatureRSV: SignatureRSV = extractSignatureToRSV(web3, signatureHash);

			// ==============================================================CALL API TO CREATE ORDER FOR DATABASE==================================================================================//
			await callingCreateOrderApi(
				order,
				signatureRSV,
				itemTokenId,
				chainId,
				itemId,
				collectionId
			);

			return true;
		} catch (error) {
			toast.error('Some error occur when creating order!');
			console.log(error);
			return false;
		}
	};

	return { ApproveRoyaltiesFee, HashOrderAndSign };
}

// =======================================================SETUP ORDER FUNCTION========================================================================== //
const setupOrderForSale = async (data: SetupOrderForSaleInput) => {
	const {
		chainId,
		userAddress,
		paymentToken,
		feeMethod,
		startPrice,
		endPrice,
		quantity,
		itemTokenId,
		itemStandard,
		collectionAddress,
		collectionOwner,
		royalties,
		web3,
		startTime,
		endTime,
		saleKind,
	} = data;

	// ======================================= SET FEE RECIPIENT (the one who will recieve royalties fee)=================================================================
	// atomic match not accept feeRecipient = NULL_ADDRESS so we need to swap null address to exchange
	const feeRecipient: string = isNullAddress(collectionOwner)
		? CONTRACT[chainId].MetaSpacecyExchange
		: collectionOwner;

	const addrs: string[] = [
		CONTRACT[chainId].MetaSpacecyExchange,
		userAddress, // maker
		'0x0000000000000000000000000000000000000000', // taker
		feeRecipient,
		collectionAddress, // target
		'0x0000000000000000000000000000000000000000', // static target
		paymentToken,
	];

	// =======================================CALCULATE MAKER RELAYER FEE =================================================================
	let makerRelayerFee: BigNumber | number;
	// DUTCH_AUCTION IS ALWAYS SPLIT_FEE_METHOD
	if (feeMethod === ORDER_CONFIGURATION.SPLIT_FEE_METHOD) {
		makerRelayerFee = royalties * 100;
	} else {
		const royaltiesFee: number = avoidFloatingPoint(startPrice * (royalties / 100));
		const relayerFeeToWei = await erc20function().changeTokenToWei(
			CONTRACT[chainId].FlatformCoin,
			royaltiesFee
		);
		makerRelayerFee = relayerFeeToWei;
	}

	// =======================================CALCULATE BASE PRICE =================================================================
	let basePriceByWei: BigNumber = BigNumber.from(0);
	//Check is Native coin
	if (isNativeToken(paymentToken)) {
		basePriceByWei = parseUnits(startPrice.toString(), 18);
	} else {
		basePriceByWei = await erc20function().changeTokenToWei(paymentToken, startPrice);
	}

	// =======================================CALCULATE EXTRA =================================================================
	let extraByWei: BigNumber = BigNumber.from(0);
	//Check is Native coin
	if (isNativeToken(paymentToken)) {
		extraByWei = parseUnits(String(startPrice - endPrice), 18);
	} else {
		extraByWei = await erc20function().changeTokenToWei(paymentToken, startPrice - endPrice);
	}

	// =======================================CALCULATE TAKER PROTOCOL FEE =================================================================
	const takerProtocolFee: number =
		feeMethod === ORDER_CONFIGURATION.SPLIT_FEE_METHOD
			? ORDER_CONFIGURATION.SELL_TAKER_PROTOCOL_FEE
			: 0;

	const uints: string[] = [
		makerRelayerFee,
		ORDER_CONFIGURATION.SELL_TAKER_RELAYER_FEE,
		ORDER_CONFIGURATION.SELL_MAKER_PROTOCOL_FEE,
		takerProtocolFee,
		basePriceByWei, // basePrice
		extraByWei, // extra
		startTime,
		endTime,
		BigNumber.from(randomBytes(32)), // salt
	].map(String);

	const feeMethodsSidesKindsHowToCalls: number[] = [
		feeMethod,
		ORDER_CONFIGURATION.SELL_SIDE,
		saleKind,
		ORDER_CONFIGURATION.CALL,
	];

	// ================================================================= CALL DATA ================================================================= //
	let calldataSell: any = null;
	if (itemStandard.includes('1155')) {
		//  STANDARD 1155
		calldataSell = encodeFunctionCall(
			web3,
			'safeTransferFrom(address,address,uint256,uint256,bytes)',
			['address', 'address', 'uint256', 'uint256', 'bytes'],
			[
				userAddress,
				'0x0000000000000000000000000000000000000000',
				itemTokenId,
				quantity,
				web3.utils.asciiToHex(''),
			]
		);
	} else {
		// STANDARD 721
		calldataSell =
			encodeFunctionCall(
				web3,
				'safeTransferFrom(address,address,uint256,bytes)',
				['address', 'address', 'uint256', 'bytes'],
				[
					userAddress,
					'0x0000000000000000000000000000000000000000',
					itemTokenId,
					web3.utils.asciiToHex(''),
				]
			) + '0'.repeat(64);
	}

	const staticExtraData = '0x';

	const result: Order = {
		exchange: addrs[0],
		maker: addrs[1],
		taker: addrs[2],
		makerRelayerFee: uints[0],
		takerRelayerFee: uints[1],
		makerProtocolFee: uints[2],
		takerProtocolFee: uints[3],
		feeRecipient: addrs[3],
		feeMethod: feeMethodsSidesKindsHowToCalls[0],
		side: feeMethodsSidesKindsHowToCalls[1],
		saleKind: feeMethodsSidesKindsHowToCalls[2],
		target: addrs[4],
		howToCall: feeMethodsSidesKindsHowToCalls[3],
		callData: calldataSell,
		replacementPattern: ORDER_CONFIGURATION.SELL_REPLACEMENT_PATTERN,
		staticTarget: addrs[5],
		staticExtraData: staticExtraData,
		paymentToken: addrs[6],
		basePrice: uints[4],
		quantity,
		extra: uints[5],
		listingTime: uints[6],
		expirationTime: uints[7],
		salt: uints[8],
	};

	return result;
};

// =======================================================GET SIGNATURE (R,S,V) FUNCTION========================================================================== //
const extractSignatureToRSV = (web3: any, signature: any) => {
	console.log('signature to VRS', {
		r: signature.slice(2, 66),
		s: signature.slice(66, 130),
		v: web3.utils.hexToNumber('0x' + signature.slice(-2)),
	});

	return {
		r: signature.slice(2, 66),
		s: signature.slice(66, 130),
		v: web3.utils.hexToNumber('0x' + signature.slice(-2)),
	};
};

// =================================================CALL API TO CREATE ORDER FOR DATABASE================================================================================ //
const callingCreateOrderApi = async (
	order: Order,
	signature: SignatureRSV,
	itemTokenId: string,
	chainId: number,
	itemId: string,
	collectionId: string
) => {
	await orderApi.createOrder(
		constructPostData(order, signature, itemTokenId, itemId, collectionId),
		chainId
	);
};

const constructPostData = (
	order: Order,
	signature: SignatureRSV,
	itemTokenId: string,
	itemId: string,
	collectionId: string
) => {
	return {
		itemId,
		itemTokenId,
		userAddress: order.maker,
		owner: order.maker,
		feeRecipient: order.feeRecipient,
		maker: order.maker,
		taker: order.taker,
		makerProtocolFee: order.makerProtocolFee,
		takerProtocolFee: order.takerProtocolFee,
		makerRelayerFee: order.makerRelayerFee,
		takerRelayerFee: order.takerRelayerFee,
		side: order.side,
		saleKind: order.saleKind,
		target: order.target,
		collectionId,
		feeMethod: order.feeMethod,
		howToCall: order.howToCall,
		callData: order.callData,
		replacementPattern: order.replacementPattern,
		staticTarget: order.staticTarget,
		staticExtraData: order.staticExtraData,
		paymentToken: order.paymentToken,
		basePrice: order.basePrice,
		sellPrice: order.basePrice,
		quantity: order.quantity,
		extra: order.extra,
		listingTime: order.listingTime,
		expirationTime: order.expirationTime,
		salt: order.salt,
		r: signature.r,
		s: signature.s,
		v: signature.v,
		type: ORDER_TYPE.SELL,
	};
};

// =======================================
