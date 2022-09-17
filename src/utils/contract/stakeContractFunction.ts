// abi
import { getWeb3Contract } from 'hooks';
import ContractMetaSpacecyStaking from 'abis/Box/MetaSpacecyStaking.json';
// utils
import { CONTRACT } from '../../constants';

export function stakeContractFunction() {
	const checkCanStake = async (
		chainId: number,
		optionId: number,
		itemTokenId: string,
		amount: number
	): Promise<boolean> => {
		let canStake: boolean = false;

		const contractMetaSpacecyStaking = getWeb3Contract(
			ContractMetaSpacecyStaking.abi,
			CONTRACT[chainId].MetaSpacecyStaking
		);

		await contractMetaSpacecyStaking.methods
			.canStake(optionId, itemTokenId, amount)
			.call()
			.then(function (result: boolean) {
				canStake = result;
			});

		return canStake;
	};

	const checkCanHarvest = async (
		userAddress: string,
		chainId: number,
		slotIndex: number
	): Promise<boolean> => {
		let canHarvest: boolean = false;

		const contractMetaSpacecyStaking = getWeb3Contract(
			ContractMetaSpacecyStaking.abi,
			CONTRACT[chainId].MetaSpacecyStaking
		);

		await contractMetaSpacecyStaking.methods
			.canHarvest(userAddress, slotIndex)
			.call()
			.then(function (result: boolean) {
				canHarvest = result;
			});

		return canHarvest;
	};

	return {
		checkCanStake,
		checkCanHarvest,
	};
}
