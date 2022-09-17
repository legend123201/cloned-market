import { AuctionInfo } from './Auction';

export interface ItemAuction {
	attributes: any;
	category: number;
	chainId: number;
	collectionId: number;
	collectionAddress: string;
	creator: string;
	description: string;
	external_url: string;
	isFreeze: boolean;
	itemId: string;
	itemMedia: string;
	itemImage: string;
	itemName: string;
	itemTokenId: string;
	listingPrice: string;
	listingPriceType: string;
	owner: string;
	standard: string;
	status: number;
	price: string;
	priceType: string;
	properties: string;
	auctionInfo: AuctionInfo | null;
}
