/* eslint-disable @typescript-eslint/no-unused-vars */
import { BigNumber } from 'ethers';
import { Collection } from './collection';
import { OrderResponseAPI } from './order';
import { User } from './user';

export interface NFT {
	_id: string;
	chainId: number; //must have
	itemTokenId: string;
	itemName: string; //must have
	description: string; //must have
	properties: object | null;
	attributes: Array<any>;
	userAddress: string; //create must have this but get not have
	owner: string[]; //get have this but create not have
	creator: string; //get have this but create not have
	status: number;
	category: number;
	price: number;
	priceType: string;
	listingPrice: string;
	listingPriceType: string;
	currentPrice: string;
	priceLogo: string;
	royalties: number;
	collectionInfo?: Collection;
	collectionId: string; //must have
	collectionName: string;
	// collectionAddress: string;
	itemStandard: string;
	isFreeze: boolean;
	usdPrice: number;
	isLike: boolean;
	interaction: number;
	order?: OrderResponseAPI[];
	itemMedia: string;
	itemOriginMedia: string;
	itemPreviewMedia: string;
	ownerInfo?: User[];
	creatorInfo?: User;
	isBox: boolean;
	upgradeFee: string;
}

export interface CreateNFTInput {
	chainId: number; //must have
	itemName: string; //must have
	description: string; //must have
	itemImage: string; //must have
	properties?: object | null;
	attributes?: Array<any>;
	userAddress: string; //create must have this but get not have
	status?: number;
	category?: number;
	price: number;
	collectionId: string; //must have
	isFreeze?: boolean;
}

export interface CreateBoxInput {
	chainId: number;
	collectionId: string;
	userAddress: string;
	transactionHash: string;
	itemTokenId: string;
}

export interface UnpackBoxInput {
	chainId: number;
	boxId: string;
	transactionHash: string;
	itemTokenId: string[];
	userAddress: string;
}

export interface Item {
	itemId?: string;
	itemName: string;
	description?: string;
	metaData: string;
	owner: string;
	creator: string;
	collectionName: string;
	itemStandard?: string;
	chainId: string;
	isFreeze?: boolean;
}

export interface GetNFTsByCollectionIdRequest {
	collectionId: string;
	chainId: number;
	page: number;
	userAddress: string;
}

export interface GetAllNftRequest {
	chainId: number;
	pageSize: number;
	page: number;
	userAddress: string | null | undefined;
}

export interface CreateAndUpdateNFTInput {
	chainId: number; //must have
	itemName: string; //must have
	description: string; //must have
	itemMedia: string; //must have
	itemPreviewMedia?: string;
	itemOriginMedia: string;
	properties?: object | null;
	attributes?: Array<any>;
	userAddress: string; //create must have this but get not have
	category?: number;
	price?: number;
	priceType?: string;
	collectionId: string; //must have
	collectionName?: string;
	collectionAddress?: string;
	standard?: string;
	isFreeze?: boolean;
	creator?: string;
}

export interface InteractionInput {
	itemId: string; //must have
	userAddress: string;
	state: boolean;
	signature: string;
}

export interface MintItemInput {
	itemTokenId: string;
	chainId: number;
	collectionAddress: string;
	userAddress: string;
	web3: any;
}

export interface MintNewBoxErc721Input {
	chainId: number;
	userAddress: string;
	optionId: number;
	receiverAddress: string;
	collectionId: string;
	collectionAddress: string;
	refetchApi: Function;
}

export interface MintNewBoxErc1155Input {
	chainId: number;
	userAddress: string;
	optionId: number;
	receiverAddress: string;
	amount: string;
	dataMint: string;
	collectionId: string;
	refetchApi: Function;
}

export interface FreezeItemInput {
	itemId: string;
	itemStandard: string;
	collectionAddress: string;
	userAddress: string;
}

export interface UnpackErc721Input {
	chainId: number;
	userAddress: string;
	collectionAddress: string;
	itemId: string;
	itemTokenId: string;
	callback: any;
}

export interface UnpackErc1155Input {
	chainId: number;
	userAddress: string;
	receiverAddress: string;
	amount: number;
	collectionAddress: string;
	itemId: string;
	itemTokenId: string;
	callback: any;
}

export interface ApproveTokenToWormholeInput {
	chainId: number;
	userAddress: string;
	totalPrice: number;
}
export interface BuyBoxInput {
	chainId: number;
	userAddress: string;
	amount: number;
	optionId: string;
	itemId: string;
	totalPriceToWei: BigNumber;
	callback: any;
}

export interface FilterNft {
	chainId: number[];
	status: number[];
	collectionId: string[];
	tokenSymbol: string;
	minPrice: string;
	maxPrice: string;
	itemName: string;
	owner: string;
	text: string;
	isFiltering: boolean;
}
