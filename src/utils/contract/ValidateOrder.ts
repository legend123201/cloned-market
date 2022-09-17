// constants
import { CONTRACT } from '../../constants';
// models
import { Order, OrderResponseAPI } from 'models';
// abi
import { getWeb3Contract } from 'hooks';
import ContractMetaSpacecyExchange from 'abis/MetaSpacecyExchange.json';
// utils
import { encodeFunctionCall } from './encoded';

export function ValidateOrder() {
	const validateOrderSignature = async (order: OrderResponseAPI, chainId: number) => {
		// contract MetaSpacecyExchange
		const contractMetaSpacecyExchange = getWeb3Contract(
			ContractMetaSpacecyExchange.abi,
			CONTRACT[chainId].MetaSpacecyExchange
		);

		const args: any = [
			[
				CONTRACT[chainId].MetaSpacecyExchange,
				order.maker,
				order.taker,
				order.feeRecipient,
				order.target,
				order.staticTarget,
				order.paymentToken,
			],
			[
				order.makerRelayerFee,
				order.takerRelayerFee,
				order.makerProtocolFee,
				order.takerProtocolFee,
				order.basePrice,
				order.extra,
				order.listingTime,
				order.expirationTime,
				order.salt,
			],
			order.feeMethod,
			order.side,
			order.saleKind,
			order.howToCall,
			order.callData,
			order.replacementPattern,
			order.staticExtraData,
			order.v,
			'0x' + order.r,
			'0x' + order.s,
		];

		console.log('args of validate order signature', args);

		const result = await contractMetaSpacecyExchange.methods
			.validateOrder_(
				args[0],
				args[1],
				args[2],
				args[3],
				args[4],
				args[5],
				args[6],
				args[7],
				args[8],
				args[9],
				[args[10], args[11]]
			)
			.call();
		console.log('result validate order signature: ', result);
	};

	const validateOrderParameters = async (order: OrderResponseAPI, chainId: number) => {
		// contract MetaSpacecyExchange
		const contractMetaSpacecyExchange = getWeb3Contract(
			ContractMetaSpacecyExchange.abi,
			CONTRACT[chainId].MetaSpacecyExchange
		);

		const args: any = [
			[
				CONTRACT[chainId].MetaSpacecyExchange,
				order.maker,
				order.taker,
				order.feeRecipient,
				order.target,
				order.staticTarget,
				order.paymentToken,
			],
			[
				order.makerRelayerFee,
				order.takerRelayerFee,
				order.makerProtocolFee,
				order.takerProtocolFee,
				order.basePrice,
				order.extra,
				order.listingTime,
				order.expirationTime,
				order.salt,
			],
			order.feeMethod,
			order.side,
			order.saleKind,
			order.howToCall,
			order.callData,
			order.replacementPattern,
			order.staticExtraData,
		];

		console.log('args of validate order parameters', args);

		const result = await contractMetaSpacecyExchange.methods
			.validateOrderParameters_(
				args[0],
				args[1],
				args[2],
				args[3],
				args[4],
				args[5],
				args[6],
				args[7],
				args[8]
			)
			.call();
		console.log('result validate order parameters: ', result);
	};

	const checkOrderCanMatch = async (
		orderBuy: OrderResponseAPI,
		orderSell: OrderResponseAPI,
		chainId: number,
		web3: any,
		isOffer: boolean,
		userAddress: string,
		itemTokenId: string,
		itemStandard: string
	) => {
		// contract MetaSpacecyExchange
		const contractMetaSpacecyExchange = getWeb3Contract(
			ContractMetaSpacecyExchange.abi,
			CONTRACT[chainId].MetaSpacecyExchange
		);

		let callData;
		if (isOffer) {
			if (itemStandard.includes('1155')) {
				//  STANDARD 1155
				callData = encodeFunctionCall(
					web3,
					'safeTransferFrom(address,address,uint256,uint256,bytes)',
					['address', 'address', 'uint256', 'uint256', 'bytes'],
					[
						userAddress,
						'0x0000000000000000000000000000000000000000',
						itemTokenId,
						orderBuy.quantity,
						web3.utils.asciiToHex(''),
					]
				);
			} else {
				// STANDARD 721
				callData =
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
		} else {
			if (itemStandard.includes('1155')) {
				//  STANDARD 1155
				callData = encodeFunctionCall(
					web3,
					'safeTransferFrom(address,address,uint256,uint256,bytes)',
					['address', 'address', 'uint256', 'uint256', 'bytes'],
					[
						'0x0000000000000000000000000000000000000000',
						userAddress,
						itemTokenId,
						orderSell.quantity,
						web3.utils.asciiToHex(''),
					]
				);
			} else {
				// STANDARD 721
				callData =
					encodeFunctionCall(
						web3,
						'safeTransferFrom(address,address,uint256,bytes)',
						['address', 'address', 'uint256', 'bytes'],
						[
							'0x0000000000000000000000000000000000000000',
							userAddress,
							itemTokenId,
							web3.utils.asciiToHex(''),
						]
					) + '0'.repeat(64);
			}
		}

		const args: any = [
			[
				// BUY
				CONTRACT[chainId].MetaSpacecyExchange,
				orderBuy.maker,
				orderBuy.taker,
				orderBuy.feeRecipient,
				orderBuy.target,
				orderBuy.staticTarget,
				orderBuy.paymentToken,
				// SELL
				CONTRACT[chainId].MetaSpacecyExchange,
				orderSell.maker,
				orderSell.taker,
				orderSell.feeRecipient,
				orderSell.target,
				orderSell.staticTarget,
				orderSell.paymentToken,
			],
			[
				// BUY
				orderBuy.makerRelayerFee,
				orderBuy.takerRelayerFee,
				orderBuy.makerProtocolFee,
				orderBuy.takerProtocolFee,
				orderBuy.basePrice,
				orderBuy.extra,
				orderBuy.listingTime,
				orderBuy.expirationTime,
				orderBuy.salt,
				// SELL
				orderSell.makerRelayerFee,
				orderSell.takerRelayerFee,
				orderSell.makerProtocolFee,
				orderSell.takerProtocolFee,
				orderSell.basePrice,
				orderSell.extra,
				orderSell.listingTime,
				orderSell.expirationTime,
				orderSell.salt,
			],
			[
				// BUY
				orderBuy.feeMethod,
				orderBuy.side,
				orderBuy.saleKind,
				orderBuy.howToCall,
				// SELL
				orderSell.feeMethod,
				orderSell.side,
				orderSell.saleKind,
				orderSell.howToCall,
			].map(String),
			isOffer ? orderBuy.callData : callData,
			isOffer ? callData : orderSell.callData,
			orderBuy.replacementPattern,
			orderSell.replacementPattern,
			orderBuy.staticExtraData,
			orderSell.staticExtraData,
		];

		console.log('args of check order can match', args);

		let result = await contractMetaSpacecyExchange.methods
			.ordersCanMatch_(
				args[0],
				args[1],
				args[2],
				args[3],
				args[4],
				args[5],
				args[6],
				args[7],
				args[8]
			)
			.call();
		console.log('OrderCanMatch: ', result);
	};

	const signOrder = async (order: Order, chainId: number, web3: any) => {
		// contract MetaSpacecyExchange
		const contractMetaSpacecyExchange = getWeb3Contract(
			ContractMetaSpacecyExchange.abi,
			CONTRACT[chainId].MetaSpacecyExchange
		);

		// get contract name
		let contractExchangeName: string = '';
		await contractMetaSpacecyExchange.methods
			.name()
			.call()
			.then(function (result: string) {
				console.log('contractMetaSpacecyExchange name', result);
				contractExchangeName = result;
			});

		// get contract version
		let contractExchangeVersion: string = '';
		await contractMetaSpacecyExchange.methods
			.version()
			.call()
			.then(function (result: string) {
				console.log('contractMetaSpacecyExchange version', result);
				contractExchangeVersion = result;
			});

		const msgParams = JSON.stringify({
			domain: {
				chainId: chainId,
				name: contractExchangeName, // ex: 'MetaSpacecy Exchange',
				verifyingContract: CONTRACT[chainId].MetaSpacecyExchange,
				version: contractExchangeVersion, // ex: 0.1
			},
			message: {
				exchange: order.exchange,
				maker: order.maker,
				taker: order.taker,
				makerRelayerFee: order.makerRelayerFee,
				takerRelayerFee: order.takerRelayerFee,
				makerProtocolFee: order.makerProtocolFee,
				takerProtocolFee: order.takerProtocolFee,
				feeRecipient: order.feeRecipient,
				feeMethod: order.feeMethod,
				side: order.side,
				saleKind: order.saleKind,
				target: order.target,
				howToCall: order.howToCall,
				callData: order.callData,
				replacementPattern: order.replacementPattern,
				staticTarget: order.staticTarget,
				staticExtradata: order.staticExtraData,
				paymentToken: order.paymentToken,
				basePrice: order.basePrice,
				extra: order.extra,
				listingTime: order.listingTime,
				expirationTime: order.expirationTime,
				salt: order.salt,
			},
			primaryType: 'Order',
			types: {
				EIP712Domain: [
					{ name: 'name', type: 'string' },
					{ name: 'version', type: 'string' },
					{ name: 'chainId', type: 'uint256' },
					{ name: 'verifyingContract', type: 'address' },
				],
				Order: [
					{ name: 'exchange', type: 'address' },
					{ name: 'maker', type: 'address' },
					{ name: 'taker', type: 'address' },
					{ name: 'makerRelayerFee', type: 'uint256' },
					{ name: 'takerRelayerFee', type: 'uint256' },
					{ name: 'makerProtocolFee', type: 'uint256' },
					{ name: 'takerProtocolFee', type: 'uint256' },
					{ name: 'feeRecipient', type: 'address' },
					{ name: 'feeMethod', type: 'uint8' },
					{ name: 'side', type: 'uint8' },
					{ name: 'saleKind', type: 'uint8' },
					{ name: 'target', type: 'address' },
					{ name: 'howToCall', type: 'uint8' },
					{ name: 'callData', type: 'bytes' }, // xxx
					{ name: 'replacementPattern', type: 'bytes' },
					{ name: 'staticTarget', type: 'address' },
					{ name: 'staticExtradata', type: 'bytes' },
					{ name: 'paymentToken', type: 'address' },
					{ name: 'basePrice', type: 'uint256' },
					{ name: 'extra', type: 'uint256' },
					{ name: 'listingTime', type: 'uint256' },
					{ name: 'expirationTime', type: 'uint256' },
					{ name: 'salt', type: 'uint256' },
				],
			},
		});

		const params = [order.maker, msgParams];
		console.log('params signature', params);

		const method = 'eth_signTypedData_v4';
		const result: string = await web3.currentProvider.request({
			method,
			params,
		});

		console.log('result signature: ', result);
		return result;
	};

	return { validateOrderSignature, validateOrderParameters, checkOrderCanMatch, signOrder };
}
