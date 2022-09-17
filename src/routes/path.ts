function path(root: string, sublink: string) {
	return `${root}${sublink}`;
}

const ROOTS_COLLECTION = '/collection';
const ROOTS_ITEM = '/item';
const ROOTS_AUCTION = '/auction';
const ROOTS_IGO = '/igo';
const ROOTS_EARN = '/earn';
const ROOTS_CATEGORY = '/category';
const ROOTS_VIEWALL = '/view-all';

// Main routes
export const PATH_PAGE = {
	user: '/user',
	viewAll: '/view-all',
	otherUser: '/other-user',
	mysteryBox: '/mystery-box',
};

// Route Collection
export const PATH_COLLECTION = {
	root: ROOTS_COLLECTION,
	trending: path(ROOTS_COLLECTION, '/trending'),
	myCollection: path(ROOTS_COLLECTION, '/my-collection'),
	detail: path(ROOTS_COLLECTION, '/detail'),
	createItem: path(ROOTS_COLLECTION, '/create-item'),
	createCollection: path(ROOTS_COLLECTION, '/create-collection'),
	editCollection: path(ROOTS_COLLECTION, '/edit-collection'),
};

// Route Items
export const PATH_ITEM = {
	root: ROOTS_ITEM,
	sell: path(ROOTS_ITEM, '/sell'),
	detail: path(ROOTS_ITEM, '/detail'),
	createItem: path(ROOTS_ITEM, '/create-item'),
	editItem: path(ROOTS_ITEM, '/edit-item'),
};

// Route Auction
export const PATH_AUCTION = {
	root: ROOTS_AUCTION,
	liveOn: path(ROOTS_AUCTION, '/live-on'),
	upComming: path(ROOTS_AUCTION, '/up-coming'),
	completed: path(ROOTS_AUCTION, '/completed'),
	attendance: path(ROOTS_AUCTION, '/attendance'),
	create: path(ROOTS_AUCTION, '/create'),
	permission: path(ROOTS_AUCTION, '/permission'),
	detail: path(ROOTS_AUCTION, '/detail'),
	igo: path(ROOTS_AUCTION, '/igo'),
};

// IGO
export const PATH_IGO = {
	root: ROOTS_IGO,
	create: path(ROOTS_IGO, '/create'),
	request: path(ROOTS_IGO, '/request'),
};

//EARN
export const PATH_EARN = {
	assets: path(ROOTS_EARN, '/assets'),
	staking: path(ROOTS_EARN, '/staking'),
	userDetail: path(ROOTS_EARN, '/user-detail'),
};
// CATEGORY
export const PATH_CATEGORY = {
	root: ROOTS_CATEGORY,
	other: path(ROOTS_CATEGORY, '/other'),
	artwork: path(ROOTS_CATEGORY, '/artwork'),
	music: path(ROOTS_CATEGORY, '/music'),
	photography: path(ROOTS_CATEGORY, '/photography'),
	games: path(ROOTS_CATEGORY, '/games'),
	sport: path(ROOTS_CATEGORY, '/sport'),
	metaverse: path(ROOTS_CATEGORY, '/metaverse'),
	box: path(ROOTS_CATEGORY, '/box'),
	card: path(ROOTS_CATEGORY, '/card'),
};

// CATEGORY
export const PATH_VIEWALL = {
	root: ROOTS_VIEWALL,
	items: path(ROOTS_VIEWALL, '/items'),
	collections: path(ROOTS_VIEWALL, '/collections'),
	user: path(ROOTS_VIEWALL, '/user'),
};
