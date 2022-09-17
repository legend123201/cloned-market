// abi
import { getWeb3Contract } from 'hooks';
import ContractWormhole from 'abis/Box/Wormhole.json';
// utils
import { CONTRACT } from '../../constants';

export function wormholeContractFunction() {
	const getRemainingBoxAmount = async (chainId: number, itemTokenId: string): Promise<number> => {
		const contractWormhole = getWeb3Contract(ContractWormhole.abi, CONTRACT[chainId].Wormhole);

		let boxBalance: number = 0;
		await contractWormhole.methods
			.balanceOfBox(itemTokenId)
			.call()
			.then(function (result: string) {
				boxBalance = Number(result);
			});

		return boxBalance;
	};

	const getRemainingCreatureAccessoryAmount = async (
		chainId: number,
		itemTokenId: string
	): Promise<number> => {
		const contractWormhole = getWeb3Contract(ContractWormhole.abi, CONTRACT[chainId].Wormhole);

		let itemBalance: number = 0;
		await contractWormhole.methods
			.balanceOfItem(itemTokenId)
			.call()
			.then(function (result: string) {
				itemBalance = Number(result);
			});

		return itemBalance;
	};

	const getBoxPrice = async (chainId: number, itemTokenId: string): Promise<number> => {
		const contractWormhole = getWeb3Contract(ContractWormhole.abi, CONTRACT[chainId].Wormhole);

		console.log('xxx', chainId, itemTokenId);

		let boxPrice: number = 0;
		await contractWormhole.methods
			.BOX_PRICE(itemTokenId)
			.call()
			.then(function (result: any) {
				boxPrice = Number(result);
			});

		return boxPrice;
	};

	const getTicketCardPrice = async (chainId: number): Promise<number> => {
		const contractWormhole = getWeb3Contract(ContractWormhole.abi, CONTRACT[chainId].Wormhole);

		let ticketCardPrice: number = 0;
		await contractWormhole.methods
			.TICKET_CARD_PRICE()
			.call()
			.then(function (result: any) {
				ticketCardPrice = Number(result);
			});

		return ticketCardPrice;
	};

	const getUpgradeAmount = async (chainId: number, currentTokenId: string): Promise<number> => {
		const contractWormhole = getWeb3Contract(ContractWormhole.abi, CONTRACT[chainId].Wormhole);

		let upgradeAmount: number = 0;
		await contractWormhole.methods
			.UPGRADE_AMOUNT(currentTokenId)
			.call()
			.then(function (result: any) {
				upgradeAmount = Number(result);
			});

		return upgradeAmount;
	};

	const getUpgradeFee = async (chainId: number, currentTokenId: string): Promise<number> => {
		const contractWormhole = getWeb3Contract(ContractWormhole.abi, CONTRACT[chainId].Wormhole);

		let ticketCardPrice: number = 0;
		await contractWormhole.methods
			.UPGRADE_FEE(currentTokenId)
			.call()
			.then(function (result: any) {
				ticketCardPrice = Number(result);
			});

		return ticketCardPrice;
	};

	const checkCanUpgrade = async (
		chainId: number,
		userAddress: string,
		toTokenId: string,
		amount: number
	): Promise<boolean> => {
		const contractWormhole = getWeb3Contract(ContractWormhole.abi, CONTRACT[chainId].Wormhole);

		let canUpgrade: boolean = false;
		await contractWormhole.methods
			.canUpgrade(userAddress, toTokenId, amount)
			.call()
			.then(function (result: boolean) {
				canUpgrade = result;
			});

		return canUpgrade;
	};

	return {
		getRemainingBoxAmount,
		getRemainingCreatureAccessoryAmount,
		getBoxPrice,
		getTicketCardPrice,
		getUpgradeAmount,
		getUpgradeFee,
		checkCanUpgrade,
	};
}
