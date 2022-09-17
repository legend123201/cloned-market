/* eslint-disable @typescript-eslint/no-unused-vars */
import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layout
import LayoutForbitNFTs from 'layouts/LayoutForbitNFTs';
// guard
import AccountGuard from 'guards/AccountGuard';
// components
import Loadable from 'components/CustomUI/LoadableComponent';

//import PATH
import {
	PATH_PAGE,
	PATH_COLLECTION,
	PATH_ITEM,
	PATH_AUCTION,
	PATH_IGO,
	PATH_EARN,
	PATH_CATEGORY,
	PATH_VIEWALL,
} from './path';

export default function Router() {
	return useRoutes([
		{
			path: '/',
			element: <LayoutForbitNFTs />,
			children: [
				{
					path: '/',
					element: <Home />,
				},
				{
					path: `${PATH_COLLECTION.root}`,
					children: [
						{
							path: `${PATH_COLLECTION.trending}`,
							element: <TrendingCollections />,
						},
						{
							path: `${PATH_COLLECTION.myCollection}`,
							element: <MyCollection />,
						},
						{
							path: `${PATH_COLLECTION.detail}/:collectionId`,
							element: <CollectionDetail />,
						},
						{
							path: `${PATH_COLLECTION.createItem}/:collectionId`,
							element: (
								<AccountGuard>
									<CreateOrEditItem />
								</AccountGuard>
							),
						},
						{
							path: `${PATH_COLLECTION.createCollection}`,
							element: (
								<AccountGuard>
									<CreateOrEditCollection />
								</AccountGuard>
							),
						},
						{
							path: `${PATH_COLLECTION.editCollection}/:collectionId`,
							element: (
								<AccountGuard>
									<CreateOrEditCollection />
								</AccountGuard>
							),
						},
					],
				},
				{
					path: `${PATH_ITEM.root}`,
					children: [
						{
							path: `${PATH_ITEM.sell}/:itemId`,
							element: (
								<AccountGuard>
									<SellItem />
								</AccountGuard>
							),
						},
						{
							path: `${PATH_ITEM.detail}/:itemId`,
							element: <ItemDetail />,
						},
						{
							path: `${PATH_ITEM.createItem}`,
							element: (
								<AccountGuard>
									<CreateOrEditItem />
								</AccountGuard>
							),
						},
						{
							path: `${PATH_ITEM.editItem}/:itemId`,
							element: (
								<AccountGuard>
									<CreateOrEditItem />
								</AccountGuard>
							),
						},
					],
				},
				{
					path: `${PATH_PAGE.user}`,
					element: (
						<AccountGuard>
							<MyInfoAccount />
						</AccountGuard>
					),
				},
				{
					path: `${PATH_PAGE.viewAll}`,
					element: <ViewAll />,
				},

				{
					path: `${PATH_IGO.root}`,
					children: [
						{
							path: '',
							element: <IgoPage />,
						},

						{
							path: `${PATH_IGO.create}`,
							element: (
								// <AccountGuard>
								<IgoCreate />
								// </AccountGuard>
							),
						},
						{
							path: `${PATH_IGO.request}`,
							element: (
								// <AccountGuard>
								<RequestIGO />
								// </AccountGuard>
							),
						},
					],
				},
				{
					path: `${PATH_AUCTION.root}`,
					element: <AuctionPage />,
				},
				{
					path: `${PATH_AUCTION.root}`,
					children: [
						{
							path: `${PATH_AUCTION.create}`,
							element: (
								<AccountGuard>
									<CreateAuction />
								</AccountGuard>
							),
						},
						{
							path: `${PATH_AUCTION.detail}/:auctionId`,
							element: <AuctionDetail />,
						},
						{
							path: `${PATH_AUCTION.permission}`,
							element: (
								<AccountGuard>
									<AuctionPermission />
								</AccountGuard>
							),
						},
					],
				},

				// EARN
				{
					path: `${PATH_EARN.assets}`,
					element: (
						<AccountGuard>
							<EarnAssets />
						</AccountGuard>
					),
				},

				{
					path: `${PATH_EARN.userDetail}`,
					element: (
						<AccountGuard>
							<EarnUserInfo />
						</AccountGuard>
					),
				},

				{
					path: `${PATH_PAGE.otherUser}/:infoAccountAddress`,
					element: <OtherInfoAccount />,
				},
				// Category

				// ViewALl
				{
					path: `${PATH_VIEWALL.root}`,
					element: <ViewAll />,
					children: [
						{
							path: '',
							element: <ViewAllItems />,
						},
						{
							path: `${PATH_VIEWALL.items}`,
							element: <ViewAllItems />,
						},
						{
							path: `${PATH_VIEWALL.collections}`,
							element: <ViewAllCollections />,
						},
						{
							path: `${PATH_VIEWALL.user}`,
							element: <ViewAllUser />,
						},
					],
				},

				// Test routes
				{
					path: 'test',
					element: <TestTheme />,
					children: [
						{
							path: 'test-grid',
							element: <TestDevide />,
						},
						{
							path: 'test-grid2',
							element: <TestDevide2 />,
						},
					],
				},
				{
					path: 'test-new',
					element: <TestGrid />,
				},
			],
		},
		{ path: '/404', element: <NotFound /> },
		{ path: '*', element: <Navigate to="/404" replace /> },
	]);
}

//IMPORT COMPONENTS
const Home = Loadable(lazy(() => import('../pages/Home')));
const TrendingCollections = Loadable(lazy(() => import('../pages/TrendingCollections')));
const ViewAll = Loadable(lazy(() => import('../pages/ViewAll')));

// account
const MyInfoAccount = Loadable(lazy(() => import('../pages/MyInfoAccount')));
const OtherInfoAccount = Loadable(lazy(() => import('../pages/OtherInfoAccount')));

// collection
const MyCollection = Loadable(lazy(() => import('../pages/MyCollection')));
const CollectionDetail = Loadable(lazy(() => import('../pages/CollectionDetail')));
const CreateOrEditCollection = Loadable(lazy(() => import('../pages/CreateOrEditCollection')));

// item
const ItemDetail = Loadable(lazy(() => import('../pages/ItemDetail'))); // item detail 2
const CreateOrEditItem = Loadable(lazy(() => import('../pages/CreateOrEditItem')));
const SellItem = Loadable(lazy(() => import('../pages/SellItem')));

// extra
const TestTheme = Loadable(lazy(() => import('../pages/Test')));
const TestGrid = Loadable(lazy(() => import('../pages/Test/TestGrid')));
const TestDevide = Loadable(lazy(() => import('../pages/Test/TestDevide')));
const TestDevide2 = Loadable(lazy(() => import('../pages/Test/TestDevide2')));
const NotFound = Loadable(lazy(() => import('../pages/NotFound')));

// Auction
const AuctionPage = Loadable(lazy(() => import('../pages/AuctionPage')));
const AuctionLiveon = Loadable(lazy(() => import('components/pages/Auction/Tabs/LiveOn')));
const AuctionUpComing = Loadable(lazy(() => import('components/pages/Auction/Tabs/UpComing')));
const AuctionCompleted = Loadable(lazy(() => import('components/pages/Auction/Tabs/Completed')));
const AuctionAttendance = Loadable(lazy(() => import('components/pages/Auction/Tabs/Attendance')));
const CreateAuction = Loadable(lazy(() => import('../pages/CreateAuction')));
const AuctionDetail = Loadable(lazy(() => import('../pages/AuctionDetail')));
const AuctionPermission = Loadable(lazy(() => import('../pages/AuctionPermission')));

//IGO
const IgoPage = Loadable(lazy(() => import('../pages/IgoPage')));
const IgoCreate = Loadable(lazy(() => import('../pages/IgoCreate')));
const RequestIGO = Loadable(lazy(() => import('../pages/RequestIGO')));

// EARN
const EarnAssets = Loadable(lazy(() => import('../pages/EarnAseets')));
const EarnUserInfo = Loadable(lazy(() => import('../pages/EarnUserInfo')));

// CATEGORY
const CategoryPage = Loadable(lazy(() => import('../pages/CategoryPage')));

// ViewAll
const ViewAllItems = Loadable(lazy(() => import('../components/pages/ViewAll/Tabs/ItemsTab')));
const ViewAllCollections = Loadable(
	lazy(() => import('../components/pages/ViewAll/Tabs/CollectionsTab'))
);
const ViewAllUser = Loadable(lazy(() => import('../components/pages/ViewAll/Tabs/UsersTab')));
