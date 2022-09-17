// abi
import { getWeb3Contract } from 'hooks';
import ContractMetaSpacecyAssetShared from 'abis/MetaSpacecyAssetShared.json';
import ContractIERC721 from 'abis/IERC721.json';
// utils
import { isOurCollection1155Address } from 'utils';

export function tokenErcFunction() {
	// this TokenContract address can be known as Collection address
	const checkTokenContractStandard = async (
		contractAddress: string
	): Promise<'ERC1155' | 'ERC721'> => {
		const contractMetaSpacecyAssetShared = getWeb3Contract(
			ContractMetaSpacecyAssetShared.abi,
			contractAddress
		);
		const interfaceId1155 = '0xd9b67a26';
		// const interfaceId721 = '0x80ac58cd';

		let standard: 'ERC1155' | 'ERC721' = 'ERC1155';
		await contractMetaSpacecyAssetShared.methods
			.supportsInterface(interfaceId1155)
			.call()
			.then(function (result: boolean) {
				if (result === true) {
					standard = 'ERC1155';
				} else {
					standard = 'ERC721';
				}
			});

		return standard;
	};

	// this function only use for erc721
	const getOwnerOfToken721 = async (
		collectionAddress: string,
		itemTokenId: string
	): Promise<string> => {
		const contractIERC721 = getWeb3Contract(ContractIERC721.abi, collectionAddress);

		let owner: string = '';
		await contractIERC721.methods
			.balanceOf(itemTokenId)
			.call()
			.then(function (result: string) {
				owner = result;
			});

		return owner;
	};

	// this function only use for erc1155
	const getBlanceOfToken1155 = async (
		userAddress: string,
		collectionAddress: string,
		itemTokenId: string
	): Promise<number> => {
		const contractMetaSpacecyAssetShared = getWeb3Contract(
			ContractMetaSpacecyAssetShared.abi,
			collectionAddress
		);

		let balance: number = 0;
		await contractMetaSpacecyAssetShared.methods
			.balanceOf(userAddress, itemTokenId)
			.call()
			.then(function (result: number) {
				balance = Number(result);
			});

		return balance;
	};

	// this function only use for erc1155
	const getMaxSupplyOfToken1155 = async (
		collectionAddress: string,
		chainId: number,
		itemTokenId: string
	): Promise<number> => {
		const contractMetaSpacecyAssetShared = getWeb3Contract(
			ContractMetaSpacecyAssetShared.abi,
			collectionAddress
		);

		if (!isOurCollection1155Address(collectionAddress, chainId)) return 0;

		let maxSupply: number = 0;
		await contractMetaSpacecyAssetShared.methods
			.maxSupply(itemTokenId)
			.call()
			.then(function (result: number) {
				maxSupply = Number(result);
			});

		return maxSupply;
	};

	// this function only use for erc1155
	const isHoldingAllItemQuantity = async (
		userAddress: string,
		chainId: number,
		collectionAddress: string,
		itemTokenId: string
	): Promise<boolean> => {
		const ownedQuantityTemp = await getBlanceOfToken1155(
			userAddress,
			collectionAddress,
			itemTokenId
		);

		const maxSupplyTemp = await getMaxSupplyOfToken1155(
			collectionAddress,
			chainId,
			itemTokenId
		);

		if (ownedQuantityTemp === maxSupplyTemp) return true;
		return false;
	};

	return {
		checkTokenContractStandard,
		getOwnerOfToken721,
		getBlanceOfToken1155,
		getMaxSupplyOfToken1155,
		isHoldingAllItemQuantity,
	};
}
