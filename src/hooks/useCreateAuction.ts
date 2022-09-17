import { selectAddress } from 'redux/slices/web3InfoSlice';
import { ethers } from 'ethers';
import { getWeb3Contract } from 'hooks';
import { useSelector } from 'react-redux';
import { selectNftAuctionAdd } from 'redux/slices/web3InfoSlice';

// const CollectionAbi = require('../abis/Collection.json');
const AuctionAbi = require('../abis/MetaSpacecyAuction.json');

export const useCreateAuction = () => {
	const nftAuctionAdd = useSelector(selectNftAuctionAdd);
	const address = useSelector(selectAddress);
	const AuctionContract = getWeb3Contract(AuctionAbi.abi, nftAuctionAdd);

	const createAuction = async (
		tokenId: number,
		minPrice: string,
		period: number,
		percentage: number,
		paymentToken: string
	) => {
		//handle BigNumber
		const minPriceHex = ethers.BigNumber.from(minPrice.toString());

		console.log({
			// collectionAdd,
			tokenId,
			paymentToken,
			minPrice,
			minPriceHex,
			period,
			percentage,
		});

		return AuctionContract.methods
			.createNewNftAuction(
				// collectionAdd,
				parseInt(tokenId.toString()),
				paymentToken,
				minPriceHex,
				period,
				percentage * 100
			)
			.send({ from: address });
	};

	return { createAuction };
};
