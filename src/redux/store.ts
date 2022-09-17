import { configureStore, combineReducers } from '@reduxjs/toolkit';
import web3InfoReducer from './slices/web3InfoSlice';
import allNftsReducer from './slices/allNftsSlice';
import collectionItemReducer from './slices/collectionItemSlice';
import allFavoriteNftsByAddressReducer from './slices/allFavoriteNftsByAddressSlice';
import allBoxesReducer from './slices/allBoxesSlice';
import allUsersReducer from './slices/allUsersSlice';
import userAssetReducer from './slices/userAssetSlice';
import nftItemReducer from './slices/nftItemByItemIdSlice';
import darkThemeReducer from './slices/darkThemeSlice';
import loadingReducer from './slices/loadingSlice';
import ratioReducer from './slices/ratioSlice';
import collectionReducer from './slices/collectionSlice';
import tradingReducer from './slices/tradingSlice';
import buyReducer from './slices/buySlice';
import stepReducer from './slices/stepSlice';
import userReducer from './slices/userSlice';
import modalReducer from './slices/modalSlice';
import tokenPaymentReducer from './slices/tokenPaymentSlice';
import orderReducer from './slices/orderSlice';
import signatureReducer from './slices/signatureSlice';
import listTopCollectionReducer from './slices/listTopCollectionSlice';
import listTopNftVolumeTradeReducer from './slices/listTopNftVolumeTrade';
import collectionCategoryReducer from './slices/collectionCategorySlice';
import collectionTrendingReducer from './slices/collectionTrendingSlice';
import boxCollectionsReducer from './slices/boxCollectionsSlice';
import auctionLiveOnReducer from './slices/auctionLiveOnSlice';
import auctionCompletedReducer from './slices/auctionCompletedSlice';
import auctionUpcomingReducer from './slices/auctionUpcomingSlice';
import auctionAttendanceReducer from './slices/auctionAttendanceSlice';
import auctionDetailByAuctionIdReducer from './slices/auctionDetailByAuctionIdSlice';
import listOrderSellReducer from './slices/listOrderSellSlice';
import listNotificationReducer from './slices/listNotificationsSlice';
import listBoxesOfUserReducer from './slices/listBoxesOfUserSlice';
import listItemsFromBoxesOfUserReducer from './slices/listItemsFromBoxesOfUserSlice';
import listStakingSlotOfUserReducer from './slices/listStakingSlotOfUserSlice';
import listStakedSlotOfUserReducer from './slices/listStakedSlotOfUserSlice';
import igoLiveOnReducer from './slices/igoLiveOnSlice';
import igoUpcomingReducer from './slices/igoUpcomingSlice';
import igoCompletedReducer from './slices/igoCompletedSlice';
import igoDetailReducer from './slices/igoDetailByIgoIdSlice';
import categoryReducer from './slices/categorySlice';

const rootReducer = combineReducers({
	allNfts: allNftsReducer, //fetch all nfts
	userAsset: userAssetReducer, //fetch all nfts by address (using in info account)
	collectionItem: collectionItemReducer, //fetch all nfts by address and collection id (using in detail collection)
	allFavoriteNftsByAddress: allFavoriteNftsByAddressReducer, //fetch all favorite nfts by address (using in info account)
	allBoxes: allBoxesReducer,
	allUsers: allUsersReducer,
	nftItem: nftItemReducer,
	web3Info: web3InfoReducer,
	darkTheme: darkThemeReducer,
	loading: loadingReducer,
	ratio: ratioReducer,
	collection: collectionReducer,
	tradeHistory: tradingReducer,
	buyAction: buyReducer,
	step: stepReducer,
	user: userReducer,
	modal: modalReducer,
	tokenPayment: tokenPaymentReducer,
	order: orderReducer,
	signature: signatureReducer,
	listTopCollection: listTopCollectionReducer,
	listTopNftVolumeTrade: listTopNftVolumeTradeReducer,
	collectionCategory: collectionCategoryReducer,
	trendingCollection: collectionTrendingReducer,
	boxCollections: boxCollectionsReducer,
	auctionLiveOn: auctionLiveOnReducer, // AUCTION LIVEON
	auctionCompleted: auctionCompletedReducer, // AUCTION COMPLETED
	auctionUpcoming: auctionUpcomingReducer, // AUCTION UPCOMING
	auctionAttendance: auctionAttendanceReducer, // AUCTION ATEENDANCE
	auctionDetail: auctionDetailByAuctionIdReducer, // AUCITON DETAIL
	listOrderSell: listOrderSellReducer,
	listNotifications: listNotificationReducer,
	listBoxesOfUser: listBoxesOfUserReducer,
	listItemsFromBoxesOfUser: listItemsFromBoxesOfUserReducer,
	listStakingSlotOfUser: listStakingSlotOfUserReducer,
	listStakedSlotOfUser: listStakedSlotOfUserReducer,
	igoLiveOn: igoLiveOnReducer, // IGO LIVE ON
	igoUpcoming: igoUpcomingReducer, // IGO UPCOMING
	igoCompleted: igoCompletedReducer, // IGO UPCOMING
	igoDetail: igoDetailReducer, // IGO UPCOMING
	category: categoryReducer, // Category
});

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false,
		}),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

const { dispatch, getState } = store;

export { store, dispatch, getState };
