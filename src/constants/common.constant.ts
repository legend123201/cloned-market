export const CATEGORY_COLLECTION: { [key: string]: any } = {
	0: 'Other',
	1: 'Artwork',
	2: 'Music',
	3: 'Photography',
	4: 'Games',
	5: 'Sport',
	6: 'Metaverse',
	7: 'Box',
	8: 'Card',
};

export const ITEM_STATUS = {
	NOT_FOR_SELL: 0,
	BUY_NOW: 1,
	TIME_AUCTION: 2,
	OPEN_FOR_OFFERS: 3,
};

export const TYPE_TRANSACTION: { [key: string]: any } = {
	1: 'Mint',
	2: 'Accept Offer',
	3: 'Sale',
	4: 'Transfer',
	5: 'Cancel',
	6: 'List',
	7: 'Order',
	8: 'Auction Create',
	9: 'Auction Settle',
	10: 'Expire',
	11: 'Unpack',
	12: 'Buy Box',
	13: 'Create Staking',
	14: 'Harvest NCA',
	15: 'Cancel Staking',
	16: 'Buy Ticket Card',
	17: 'Upgrade',
	18: 'Burn',
};

export const ORDER_TYPE: { [key: string]: any } = {
	SELL: 0,
	OFFER: 1,
	BUY: 2,
	ACCEPT_OFFER: 3,
	EXPIRED_LISTING: 4,
};

export const TYPE_NOTIFICATION: { [key: number]: string } = {
	1: 'Offer',
	2: 'Accept Offer',
	3: 'Buy',
	4: 'Sale',
	5: 'Auction Upcoming',
	6: 'Auction Start',
	7: 'Auction Settle',
	8: 'Make Bid',
};
