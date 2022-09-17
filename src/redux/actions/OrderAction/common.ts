import { toast } from 'react-toastify';
// constant
import { CONTRACT } from '../../../constants';
// abi
import { getWeb3Contract } from 'hooks';
import ContractMetaSpacecyProxyRegistry from 'abis/MetaSpacecyProxyRegistry.json';
import ContractMetaSpacecyAssetShared from 'abis/MetaSpacecyAssetShared.json';
import ContractIERC721 from 'abis/IERC721.json';
import ContractMetaSpacecyExchange from 'abis/MetaSpacecyExchange.json';
// utils
import { isNullAddress } from 'utils';
import { BigNumber } from 'ethers';
// model
import { ApproveWalletNftAssetInput, OrderResponseAPI } from 'models';

// isChecking === true => this function just to check => "return" means approved or not.
// isChecking === false => this function approve nfts in wallet  => "return" means succeed or not.
export const ApproveWalletNftAsset = async (
	data: ApproveWalletNftAssetInput,
	isChecking: boolean
): Promise<boolean> => {
	const { chainId, userAddress, collectionAddress, itemStandard } = data;

	try {
		// contract MetaSpacecyProxyRegistry
		const contractMetaSpacecyProxyRegistry = getWeb3Contract(
			ContractMetaSpacecyProxyRegistry.abi,
			CONTRACT[chainId].MetaSpacecyProxyRegistry
		);

		// contract Factory
		let contractFactory: any = null;
		if (itemStandard.includes('1155')) {
			// STANDARD 1155
			contractFactory = getWeb3Contract(
				ContractMetaSpacecyAssetShared.abi,
				collectionAddress
			);
		} else {
			// STANDARD 721
			contractFactory = getWeb3Contract(ContractIERC721.abi, collectionAddress);
		}

		// =======================================================GET PROXY OF USER (RETURN NULL ADDRESS IF USER DON'T HAVE)=======================================================//
		let proxy: string = '';
		await contractMetaSpacecyProxyRegistry.methods
			.proxies(userAddress)
			.call()
			.then(function (result: string) {
				console.log('proxy', result);
				proxy = result;
			});

		// ==========================================================IF USER DON'T HAVE, REGISTER PROXY FOR USER==============================================================================//
		if (isNullAddress(proxy)) {
			// Not register proxy yet + isChecking => return false immediately
			if (isChecking) {
				return false;
			} else {
				//=======================Register Proxy=============================//
				await contractMetaSpacecyProxyRegistry.methods
					.registerProxy()
					.send({ from: userAddress })
					.then(function (receipt: any) {
						console.log('receipt for register proxy', receipt);
					});

				//=======================GET PROXY OF USER AGAIN=============================//
				await contractMetaSpacecyProxyRegistry.methods
					.proxies(userAddress)
					.call()
					.then(function (result: string) {
						console.log('proxy', result);
						proxy = result;
					});
			}
		}

		// ==============================================================CHECK APPROVE ITEM FOR SALE==================================================================================//
		let isApproved: boolean = false;
		await contractFactory.methods
			.isApprovedForAll(userAddress, proxy)
			.call()
			.then(function (result: boolean) {
				console.log('isApproved', result);
				isApproved = result;
			});

		// ==============================================================APPROVE ITEM IF USER HAVEN'T APPROVE =========================================================================//
		if (!isApproved) {
			// Not approvedForAll yet + isChecking => return false immediately
			if (isChecking) {
				return false;
			} else {
				// Approve item
				await contractFactory.methods
					.setApprovalForAll(proxy, true)
					.send({ from: userAddress })
					.then(function (receipt: any) {
						console.log('receipt for approved', receipt);
					});
			}
		}

		return true;
	} catch (error) {
		if (isChecking) {
			toast.error('Some error occur when checking your wallet initialize!');
		} else {
			toast.error('Some error occur when initializing your wallet!');
		}
		console.log(error);
		return false;
	}
};

// Calculate price for dutch
export const CalculateFinalPrice = async (
	orderSell: OrderResponseAPI,
	chainId: number
): Promise<BigNumber> => {
	// contract MetaSpacecyExchange
	const contractMetaSpacecyExchange = getWeb3Contract(
		ContractMetaSpacecyExchange.abi,
		CONTRACT[chainId].MetaSpacecyExchange
	);

	const result: BigNumber = await contractMetaSpacecyExchange.methods
		.calculateFinalPrice(
			orderSell.side,
			orderSell.saleKind,
			orderSell.basePrice,
			orderSell.extra,
			orderSell.listingTime,
			orderSell.expirationTime
		)
		.call();

	return result;
};
