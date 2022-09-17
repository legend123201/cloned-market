/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'react-toastify';
// abis
import { getWeb3Contract } from 'hooks';
import ContractWormhole from 'abis/Box/Wormhole.json';
import ContractFactoryBoxERC721 from 'abis/Box/FactoryBoxERC721.json';
import ContractMetaSpacecyMysteriousBox from 'abis/Box/MetaSpacecyMysteriousBox.json';
import ContractAssetBoxERC721 from 'abis/Box/AssetBoxERC721.json';
import ContractMetaSpacecyCreatureAccessory from 'abis/Box/MetaSpacecyCreatureAccessory.json';
import ContractMetaSpacecyStaking from 'abis/Box/MetaSpacecyStaking.json';
// models
import {
	CreateBoxInput,
	MintNewBoxErc721Input,
	MintNewBoxErc1155Input,
	UnpackBoxInput,
	UnpackErc721Input,
	UnpackErc1155Input,
	BuyBoxInput,
	Response,
	ApproveTokenToWormholeInput,
} from 'models';
// apis
import nftsApi from 'apis/nftsApi';
// utils
import { erc20function, hexToDecimal } from 'utils';
import { BigNumber } from 'ethers';
// constants
import { CONTRACT } from '../../../constants';

export function BoxAction() {
	// mint new box erc721 => "return" means succeed or not.
	const MintNewBoxErc721 = async (data: MintNewBoxErc721Input): Promise<boolean> => {
		const {
			chainId,
			userAddress,
			optionId,
			receiverAddress,
			collectionId,
			collectionAddress,
			refetchApi,
		} = data;

		try {
			const contractFactoryBoxErc721 = getWeb3Contract(
				ContractFactoryBoxERC721.abi,
				collectionAddress
			);

			let tokenId: string = '';
			let transactionHash: string = '';

			await contractFactoryBoxErc721.methods
				.mint(optionId, receiverAddress)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractFactoryBoxErc721 mint', result);
					tokenId = result?.events?.Transfer?.returnValues?.tokenId;
					transactionHash = result?.transactionHash;
				});

			const data: CreateBoxInput = {
				chainId,
				collectionId,
				userAddress: receiverAddress,
				transactionHash,
				itemTokenId: tokenId,
			};

			await nftsApi.createBox(data);

			refetchApi();

			return true;
		} catch (error) {
			toast.error('Some error occur when minting new box!');
			console.log(error);
			return false;
		}
	};

	// mint new box erc1155 => "return" means succeed or not.
	const MintNewBoxErc1155 = async (data: MintNewBoxErc1155Input): Promise<boolean> => {
		const {
			chainId,
			userAddress,
			optionId,
			receiverAddress,
			amount,
			dataMint,
			collectionId,
			refetchApi,
		} = data;

		try {
			const contractWormhole = getWeb3Contract(
				ContractWormhole.abi,
				CONTRACT[chainId].Wormhole
			);

			let tokenId: string = '';
			let transactionHash: string = '';
			await contractWormhole.methods
				.mint(optionId, receiverAddress, amount, dataMint)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractFactoryBoxErc1155 mint', result);
					const raw: string = result?.events[0]?.raw;
					tokenId = String(hexToDecimal(raw.slice(2, 64 + 2)));
					// amount = raw.slice(-64);
					transactionHash = result?.transactionHash;
				});

			const data: CreateBoxInput = {
				chainId,
				collectionId,
				userAddress: receiverAddress,
				transactionHash,
				itemTokenId: tokenId,
			};

			await nftsApi.createBox(data);

			refetchApi();

			return true;
		} catch (error) {
			toast.error('Some error occur when minting new box!');
			console.log(error);
			return false;
		}
	};

	// unpack box erc721 => "return" means succeed or not.
	const UnpackErc721 = async (data: UnpackErc721Input): Promise<boolean> => {
		const { chainId, userAddress, collectionAddress, itemId, itemTokenId, callback } = data;

		try {
			const contractAssetBoxERC721 = getWeb3Contract(
				ContractAssetBoxERC721.abi,
				collectionAddress
			);

			let tokenId: string = '';
			let transactionHash: string = '';

			await contractAssetBoxERC721.methods
				.unpack(itemTokenId)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractAssetBoxERC721 unpack', result);
					tokenId = result?.events?.Transfer[0]?.returnValues?.tokenId;
					transactionHash = result?.transactionHash;
				});

			const data: UnpackBoxInput = {
				chainId,
				boxId: itemId, // boxId is mongo id
				transactionHash,
				itemTokenId: [tokenId], // itemTokenId is "item in box" id
				userAddress,
			};

			console.log('data gui len ne', data);

			const res: Response<any> = await nftsApi.unpackBox(data);
			console.log(res.data);

			callback(['a', 'b', 'c']);

			return true;
		} catch (error) {
			toast.error('Some error occur when unpacking box!');
			console.log(error);
			return false;
		}
	};

	// unpack box erc1155 => "return" means succeed or not.
	const UnpackErc1155 = async (data: UnpackErc1155Input): Promise<boolean> => {
		const {
			chainId,
			userAddress,
			receiverAddress,
			amount,
			collectionAddress,
			itemId,
			itemTokenId,
			callback,
		} = data;

		try {
			const contractMetaSpacecyMysteriousBox = getWeb3Contract(
				ContractMetaSpacecyMysteriousBox.abi,
				collectionAddress
			);

			let arrTokenId: string[] = [];
			let transactionHash: string = '';

			await contractMetaSpacecyMysteriousBox.methods
				.unpack(itemTokenId, receiverAddress, amount)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractAssetBoxERC1155 unpack', result);
					// arrTokenId = result?.events?.TransferSingle?.returnValues?.tokenId;
					const arrTransferSingle = result?.events?.TransferSingle;
					if (arrTransferSingle) {
						arrTokenId = arrTransferSingle.map((item: any) => item.returnValues?.id);
						arrTokenId.shift(); // first element is burned box, so we delete its id
					}
					transactionHash = result?.transactionHash;
				});

			const data: UnpackBoxInput = {
				chainId,
				boxId: itemId, // boxId is mongo id
				transactionHash,
				itemTokenId: arrTokenId, // itemTokenId is "item in box" id
				userAddress: receiverAddress,
			};

			// console.log('data gui len ne', data);

			// const res: Response<any> = await nftsApi.unpackBox(data);
			// console.log(res.data);

			callback(['a', 'b', 'c']);

			return true;
		} catch (error) {
			toast.error('Some error occur when unpacking box!');
			console.log(error);
			return false;
		}
	};

	// approve token (coin) => "return" means succeed or not.
	const ApproveTokenToWormhole = async (data: ApproveTokenToWormholeInput): Promise<boolean> => {
		const { chainId, userAddress, totalPrice } = data;

		try {
			const totalPriceToWei: BigNumber = await erc20function().changeTokenToWei(
				CONTRACT[chainId].MetaSpacecyToken,
				totalPrice
			);

			await erc20function().increaseAmountAllowance(
				CONTRACT[chainId].MetaSpacecyToken,
				totalPriceToWei,
				userAddress,
				CONTRACT[chainId].Wormhole
			);

			return true;
		} catch (error) {
			toast.error('Some error occur when approving money to buy box!');
			console.log(error);
			return false;
		}
	};

	// isChecking === true => this function just to check => "return" means approved or not.
	// isChecking === false => this function approve nfts in wallet  => "return" means succeed or not.
	const ApproveItemForStake = async (data: any, isChecking: boolean): Promise<boolean> => {
		const { chainId, userAddress } = data;

		try {
			// contract MetaSpacecyCreatureAccessory
			const contractMetaSpacecyCreatureAccessory = getWeb3Contract(
				ContractMetaSpacecyCreatureAccessory.abi,
				CONTRACT[chainId].MetaSpacecyCreatureAccessory
			);

			// ============================================================== CHECK APPROVED =========================================================================//
			let isApproved: boolean = false;
			await contractMetaSpacecyCreatureAccessory.methods
				.isApprovedForAll(userAddress, CONTRACT[chainId].MetaSpacecyStaking)
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
					await contractMetaSpacecyCreatureAccessory.methods
						.setApprovalForAll(CONTRACT[chainId].MetaSpacecyStaking, true)
						.send({ from: userAddress })
						.then(function (receipt: any) {
							console.log('receipt for approved', receipt);
						});
				}
			}

			return true;
		} catch (error) {
			toast.error('Some error occur when initializing your wallet for staking!');
			console.log(error);
			return false;
		}
	};

	// isChecking === true => this function just to check => "return" means approved or not.
	// isChecking === false => this function approve nfts in wallet  => "return" means succeed or not.
	const ApproveItemForUpgrade = async (data: any, isChecking: boolean): Promise<boolean> => {
		const { chainId, userAddress } = data;

		try {
			// contract MetaSpacecyCreatureAccessory
			const contractMetaSpacecyCreatureAccessory = getWeb3Contract(
				ContractMetaSpacecyCreatureAccessory.abi,
				CONTRACT[chainId].MetaSpacecyCreatureAccessory
			);

			// ============================================================== CHECK APPROVED =========================================================================//
			let isApproved: boolean = false;
			await contractMetaSpacecyCreatureAccessory.methods
				.isApprovedForAll(userAddress, CONTRACT[chainId].Wormhole)
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
					await contractMetaSpacecyCreatureAccessory.methods
						.setApprovalForAll(CONTRACT[chainId].Wormhole, true)
						.send({ from: userAddress })
						.then(function (receipt: any) {
							console.log('receipt for approved', receipt);
						});
				}
			}

			return true;
		} catch (error) {
			toast.error('Some error occur when initializing your wallet for staking!');
			console.log(error);
			return false;
		}
	};

	// buy box => "return" means succeed or not.
	const BuyBox = async (data: BuyBoxInput): Promise<boolean> => {
		const { chainId, userAddress, amount, optionId, itemId, callback } = data;

		try {
			const contractWormhole = getWeb3Contract(
				ContractWormhole.abi,
				CONTRACT[chainId].Wormhole
			);

			await contractWormhole.methods
				.buyBox(optionId, amount)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractFactoryBoxErc1155 buyBox', result);
				});

			callback();

			// const data: any = {
			// 	boxId: itemId, // boxId is mongo id
			// 	userAddress,
			// };

			// console.log('data gui len ne', data);

			// const res: Response<any> = await nftsApi.buyBox(data);
			// console.log(res);

			return true;
		} catch (error) {
			toast.error('Some error occur when perchasing box!');
			console.log(error);
			return false;
		}
	};

	// buy ticket card => "return" means succeed or not.
	const BuyTicketCard = async (data: any): Promise<boolean> => {
		const { chainId, userAddress, amount } = data;

		try {
			const contractWormhole = getWeb3Contract(
				ContractWormhole.abi,
				CONTRACT[chainId].Wormhole
			);

			await contractWormhole.methods
				.buyTicketCard(amount)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractWormhole buyTicketCard', result);
				});

			return true;
		} catch (error) {
			toast.error('Some error occur when perchasing ticketcard!');
			console.log(error);
			return false;
		}
	};

	// Stake item => "return" means succeed or not.
	const StakeItem = async (data: any): Promise<boolean> => {
		const { chainId, userAddress, amount, optionStake, itemTokenId, callback } = data;

		try {
			const contractMetaSpacecyStaking = getWeb3Contract(
				ContractMetaSpacecyStaking.abi,
				CONTRACT[chainId].MetaSpacecyStaking
			);

			console.log('data stake', { optionStake, itemTokenId, amount });

			await contractMetaSpacecyStaking.methods
				.stake(optionStake, itemTokenId, amount)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractMetaSpacecyStaking stake', result);
				});

			toast.success('Stake item successfully!');

			return true;
		} catch (error) {
			toast.error('Some error occur when stake item!');
			console.log(error);
			return false;
		}
	};

	// Harvest item => "return" means succeed or not.
	const HarvestItem = async (data: any): Promise<boolean> => {
		const { chainId, userAddress, slotIndex, callback } = data;

		try {
			const contractMetaSpacecyStaking = getWeb3Contract(
				ContractMetaSpacecyStaking.abi,
				CONTRACT[chainId].MetaSpacecyStaking
			);

			await contractMetaSpacecyStaking.methods
				.harvest(slotIndex)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractStaking harvest', result);
				});

			return true;
		} catch (error) {
			toast.error('Some error occur when harvesting item!');
			console.log(error);
			return false;
		}
	};

	// Cancel staking => "return" means succeed or not.
	const CancelStaking = async (data: any): Promise<boolean> => {
		const { chainId, userAddress, slotIndex, callback } = data;

		try {
			const contractMetaSpacecyStaking = getWeb3Contract(
				ContractMetaSpacecyStaking.abi,
				CONTRACT[chainId].MetaSpacecyStaking
			);

			await contractMetaSpacecyStaking.methods
				.withdraw(slotIndex)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractStaking withdraw', result);
				});

			return true;
		} catch (error) {
			toast.error('Some error occur when cancel staking!');
			console.log(error);
			return false;
		}
	};

	// upgarde item => "return" means succeed or not.
	const UpgradeItem = async (data: any): Promise<boolean> => {
		const { chainId, userAddress, toTokenId } = data;

		try {
			const contractWormhole = getWeb3Contract(
				ContractWormhole.abi,
				CONTRACT[chainId].Wormhole
			);

			await contractWormhole.methods
				.upgrade(toTokenId, 1)
				.send({ from: userAddress })
				.then(function (result: any) {
					console.log('result contractWormhole upgrade', result);
				});

			return true;
		} catch (error) {
			toast.error('Some error occur when upgrading item!');
			console.log(error);
			return false;
		}
	};

	return {
		MintNewBoxErc721,
		MintNewBoxErc1155,
		UnpackErc721,
		UnpackErc1155,
		ApproveTokenToWormhole,
		ApproveItemForStake,
		ApproveItemForUpgrade,
		BuyBox,
		BuyTicketCard,
		StakeItem,
		HarvestItem,
		CancelStaking,
		UpgradeItem,
	};
}
