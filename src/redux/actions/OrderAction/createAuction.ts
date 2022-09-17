/* eslint-disable @typescript-eslint/no-unused-vars */

import { toast } from 'react-toastify';
// constant
import { CONTRACT } from '../../../constants';
// abi
import { getWeb3Contract } from 'hooks';
import IERC721 from 'abis/IERC721.json';
// utils
import { isNullAddress } from 'utils';
import { BigNumber } from 'ethers';
// model
import { ApproveAuction, OrderResponseAPI } from 'models';

// isChecking === true => this function just to check => "return" means approved or not.
// isChecking === false => this function approve nfts in wallet  => "return" means succeed or not.
export const ApproveAuctionFunction = async (
	data: ApproveAuction,
	isChecking: boolean
): Promise<boolean> => {
	const { userAddress, collectionAddress, auctionAddress } = data;

	try {
		// contract Factory
		let contractFactory: any = null;

		// STANDARD 721
		contractFactory = getWeb3Contract(IERC721.abi, collectionAddress);

		// ==============================================================CHECK APPROVE ITEM FOR SALE==================================================================================//
		let isApproved: boolean = false;
		await contractFactory.methods
			.isApprovedForAll(userAddress, auctionAddress)
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
				//Approve item
				await contractFactory.methods
					.setApprovalForAll(auctionAddress, true)
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
