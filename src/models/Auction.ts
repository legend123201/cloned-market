import { User } from './user';

export interface ItemInfo {
	tokenId: number;
	itemInfo: ItemData;
	auctionInfo: AuctionInfo;
}

export interface ItemData {
	description: string;
	name: string;
	image: string;
}
export interface AuctionInfo {
	_id: string;
	collectionId: string;
	auctionId: string;
	chainId: number;
	amountBidder: number;
	bidIncreasePercent: number;
	expirationTime: number;
	highestBid: number;
	highestBidUsd: number;
	highestBidder: string;
	isLive: boolean;
	minPrice: number;
	minPriceUsd: number;
	paymentToken: string;
	recipient: string;
	seller: string;
	startTime: number;
	endTime: number;
	listItemId: string[];
	favoriteUser: string[];
	items: itemsLessInfo[];
	infoINO: infoINOLessInfo;
	collectionInfo: collectionInfo;
	priceType: string;
	status: string;
	ownerInfo: onwerLessInfo;
}

export interface CreateAuctionInput {
	collectionId: string;
	items: string[];
	minPrice: string;
	bidIncreasePercent: number;
	expirationTime: number;
	paymentToken: string;
	seller: string;
	transactionHash: string;
	chainId: number;
}

export interface ItemId {
	_id: string;
}

export interface itemsLessInfo {
	_id: string;
	itemName: string;
	itemMedia: string;
	itemTokenId: number;
}
export interface infoINOLessInfo {
	chainId: number;
	createAt: string;
	descriptionINO: string;
	nameINO: string;
	typeINO: number;
	updatedAt: string;
	whiteList: string;
	addressINO: string;
}

export interface INO {
	_id: string;
	nameINO: string;
}

export interface INODetail {
	_id: string;
	chainId: number;
	addressINO: string;
	collectionId: string;
	listItemId: string[];
	nameINO: string;
	ownerINO: string;
	descriptionINO: string;
	typeINO: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
	items: itemsInINO[];
	collectionInfo: collectionInfoInINO;
}

export interface itemsInINO {
	_id: string;
	itemTokenId: number;
	itemName: string;
	itemMedia: string;
}

export interface collectionInfoInINO {
	_id: string;
	collectionAddress: string;
	logo: string;
	collectionName: string;
}

export interface collectionInfo {
	_id: string;
	collectionAddress: string;
}

export interface listBider {
	_id: string;
	auctionId: string;
	userAddress: string;
	bidAmount: string;
	transactionHash: string;
	createdAt: string;
	updatedAt: string;
	tokenAmount: number;
	priceType: string;
	userInfo: User;
}
export interface onwerLessInfo {
	_id: string;
	userAddress: string;
	username: string;
}
