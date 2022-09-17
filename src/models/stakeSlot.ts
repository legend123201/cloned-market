import { NFT } from './NFT';

export interface StakeSlot {
	createdAt: string;
	isHarvest: boolean;
	itemAmount: number;
	itemId: string;
	itemInfo: NFT;
	option: number;
	reward: number;
	slotIndex: number;
	startTime: number;
	ticketCardAmount: number;
	ticketCardId: string;
	ticketInfo: NFT;
	updatedAt: string;
	userAddress: string;
	chainId: number;
	_id: string;
}
