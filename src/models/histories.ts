export interface HistoryIdsByTxHash {
	histories: string[];
	txHash: string;
}

export interface HistoryActivity {
	historyId: string;
	collectionId: string;
	collectionName: string;
	createdAt: Date;
	from: string;
	to: string;
	price: string;
	priceType: string;
	type: number;
	txHash: string;
	tokenPrice: number;
	itemTokenId: string;
	quantity: number;
	itemInfo: lessInfoItemInfo;
	toUserInfo: lessInfoUserInfo;
	fromUserInfo: lessInfoUserInfo;
	chainId: number;
}

export interface PriceActivity {
	date: string;
	avgPrice: number;
}

export interface LatestTransaction {
	collectionId: string;
	createdAt: string;
	createTime: number;
	from: string;
	itemId: string;
	itemName: string;
	price: string;
	priceType: string;
	tokenPrice: number;
	txHash: string;
	username: string;
	avatar: string;
}
export interface lessInfoItemInfo {
	chainId: number;
	itemMedia: string;
	itemName: string;
	itemTokenId: string;
	itemPreviewMedia: string;
	_id: string;
}

export interface lessInfoUserInfo {
	avatar: string;
	userAddress: string;
	_id: string;
}
