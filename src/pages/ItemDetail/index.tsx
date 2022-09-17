/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from 'redux/slices/nftItemByItemIdSlice';
import { selectNftItem } from 'redux/slices/nftItemByItemIdSlice';
import { selectChainId, selectAddress } from 'redux/slices/web3InfoSlice';
import { selectFilter } from 'redux/slices/orderSlice';
import { fetchListOrderSell } from 'redux/actions/listOrderSellAction';
//actions
import { fetchDetailNftItemById } from 'redux/actions/nftItemByItemIdAction';
import { fetchListPaymentTokenByChainId } from 'redux/actions/tokenPaymentAction';
import { fetchListOrderOffer } from 'redux/actions/orderAction';
// models
import { ListResponseNonPaging, NFT, OrderResponseAPI, PriceActivity, Response } from 'models';
// mui
import { Container, Grid, Box, useTheme, Typography } from '@mui/material';
// api
import orderApi from 'apis/orderApi';
import historyApi from 'apis/historyApi';
// components
import ItemImage from 'components/pages/ItemDetail/ItemImage';
import ItemInformation from 'components/pages/ItemDetail/ItemInformation';
import TabItemDetail from 'components/pages/ItemDetail/TabItemDetail';
import TradingHistory from 'components/pages/ItemDetail/TradingHistory';
import MoreItem from 'components/pages/ItemDetail/MoreItem';
import Loading from 'components/CustomUI/LoadingPage';
// utils
import { compareDate, timestampToDate } from 'utils';
// constants
import { ORDER_TYPE } from '../../constants';
// styled
import { WrapperImage } from './styled';

declare let window: any;

// const item: NFT = {
// 	_id: '547265748324',
// 	chainId: 4,
// 	itemTokenId: '5',
// 	itemName: 'a',
// 	description: 'a',
// 	properties: null,
// 	attributes: [],
// 	userAddress: 'a',
// 	owner: [],
// 	creator: 'a',
// 	status: 4,
// 	category: 4,
// 	price: 4,
// 	priceType: 'a',
// 	listingPrice: 'a',
// 	listingPriceType: 'a',
// 	currentPrice: 'a',
// 	priceLogo: 'a',
// 	royalties: 4,
// 	collectionId: 'a',
// 	collectionName: 'a',
// 	itemStandard: 'a',
// 	isFreeze: false,
// 	usdPrice: 4,
// 	isLike: false,
// 	interaction: 4,
// 	itemMedia: 'https://deothemes.com/envato/xhibiter/html/img/products/item_single_large.jpg',
// 	itemOriginMedia: 'a',
// 	itemPreviewMedia: 'a',
// 	isBox: false,
// };

const ItemDetail = () => {
	const theme = useTheme();
	const { itemId } = useParams();
	const dispatch = useDispatch();

	// vars
	const isLightTheme = theme.palette.mode === 'light';

	//state
	const [listActivityPriceChart, setListActivityPriceChart] = useState<PriceActivity[]>([]);
	const [personalOffer, setPersonalOffer] = useState<OrderResponseAPI | null>(null);
	const [personalOrderSell, setPersonalOrderSell] = useState<OrderResponseAPI | null>(null);
	const [isLoadingPersonalOffer, setIsLoadingPersonalOffer] = useState<boolean>(false);
	const [isLoadingPersonalOrderSell, setIsLoadingPersonalOrderSell] = useState<boolean>(false);
	const [isDeletingOrderExpired, setIsDeletingOrderExpired] = useState<boolean>(false);
	const [stateRefetchApi, setStateRefetchApi] = useState<boolean>(false);

	//selector
	const item: NFT | null = useSelector(selectNftItem);
	const chainId = useSelector(selectChainId);
	const isLoadingItem = useSelector(selectLoading);
	const filter = useSelector(selectFilter);
	const addressState = useSelector(selectAddress);

	//useEffect
	// fetch NFT detail
	useEffect(() => {
		if (itemId) dispatch(fetchDetailNftItemById(itemId, executeAfterFetchNftItemById));

		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateRefetchApi, itemId]);

	// fetch list payment token
	useEffect(() => {
		if (chainId) {
			dispatch(fetchListPaymentTokenByChainId(chainId, executeAfterFetchListTokenPayment));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	// fetch list order offer
	useEffect(() => {
		if (chainId && itemId) {
			dispatch(fetchListOrderOffer({ itemId, ...filter }, executeAfterFetchListOrderOffer));
		}
	}, [dispatch, chainId, filter, stateRefetchApi, itemId]);

	//fetch personal order offer
	useEffect(() => {
		if (addressState && itemId) {
			(async () => {
				try {
					setIsLoadingPersonalOffer(true);
					const offerRes: Response<any> = await orderApi.getPersonalOffer(
						addressState,
						itemId
					);

					setPersonalOffer(offerRes.data[0]);
				} catch (error: any) {
					setPersonalOffer(null);
					console.log(error.message);
				} finally {
					setIsLoadingPersonalOffer(false);
				}
			})();
		}
	}, [addressState, itemId, stateRefetchApi]);

	// fetch list order sell
	useEffect(() => {
		if (chainId && itemId) {
			dispatch(fetchListOrderSell(itemId, chainId, executeAfterFetchListOrderSell));
		}
	}, [dispatch, chainId, stateRefetchApi, itemId]);

	//fetch personal order sell
	useEffect(() => {
		if (addressState && itemId) {
			(async () => {
				try {
					setIsLoadingPersonalOrderSell(true);
					const offerRes: Response<any> = await orderApi.getPersonalOrderSell(
						addressState,
						itemId
					);

					setPersonalOrderSell(offerRes.data);
				} catch (error: any) {
					setPersonalOrderSell(null);
					console.log(error.message);
				} finally {
					setIsLoadingPersonalOrderSell(false);
				}
			})();
		}
	}, [addressState, itemId, stateRefetchApi]);

	// fetch activity price chart
	useEffect(() => {
		if (itemId) {
			(async function () {
				try {
					const response: ListResponseNonPaging<PriceActivity> =
						await historyApi.getActivityPriceChart(itemId);

					setListActivityPriceChart(response.data);
				} catch (e: any) {
					console.log(e);
				}
			})();
		}
	}, [dispatch, stateRefetchApi, itemId]);

	//function
	const refetchApi = () => {
		setStateRefetchApi(!stateRefetchApi);
	};

	const executeAfterFetchNftItemById = async (globalStateNewest: RootState) => {
		const { nftItem } = globalStateNewest;

		if (!nftItem.isSuccess) {
			toast.error(nftItem.errorMessage, {
				autoClose: 2500,
			});
			return;
		}

		// check expire order sell
		if (
			personalOrderSell &&
			compareDate(new Date(), timestampToDate(parseInt(personalOrderSell.expirationTime))) > 0
		) {
			try {
				setIsDeletingOrderExpired(true);
				// call api delete order sell and save a history record on database
				const collectionId = nftItem.NFTItem!.collectionInfo?._id;

				const deleteData = {
					collectionId,
					orderId: personalOrderSell.orderId ?? personalOrderSell._id,
					type: ORDER_TYPE.EXPIRED_LISTING,
					transactionHash: '',
				};

				await orderApi.deleteOrder(deleteData);

				refetchApi();
			} catch (error) {
				toast.error('Some error occur when executing your expired order sell!');
			} finally {
				setIsDeletingOrderExpired(false);
			}
		}

		// check expire order offer
		if (
			personalOffer &&
			compareDate(new Date(), timestampToDate(parseInt(personalOffer.expirationTime))) > 0
		) {
			try {
				setIsDeletingOrderExpired(true);
				// call api delete order sell and save a history record on database
				const collectionId = nftItem.NFTItem!.collectionInfo?._id;

				const deleteData = {
					collectionId,
					orderId: personalOffer.orderId ?? personalOffer._id,
					type: ORDER_TYPE.OFFER,
					transactionHash: '',
				};

				await orderApi.deleteOrder(deleteData);

				refetchApi();
			} catch (error) {
				toast.error('Some error occur when executing your expired offer!');
			} finally {
				setIsDeletingOrderExpired(false);
			}
		}
	};

	const executeAfterFetchListTokenPayment = (globalStateNewest: RootState) => {
		const { tokenPayment } = globalStateNewest;
		if (!tokenPayment.isSuccess) {
			toast.error('Can not fetch list token payment!');
		}
	};

	const executeAfterFetchListOrderOffer = (globalStateNewest: RootState) => {
		const { order } = globalStateNewest;
		if (!order.isSuccess) {
			toast.error('Can not fetch order offer of this item!');
		}
	};

	const executeAfterFetchListOrderSell = (globalStateNewest: RootState) => {
		const { listOrderSell } = globalStateNewest;
		if (!listOrderSell.isSuccess) {
			toast.error('Can not fetch lising orders of this item!');
		}
	};

	return (
		<Container maxWidth="xl" sx={{ mt: 15 }}>
			{/* Item image / Item info */}
			<Grid container spacing={10}>
				<Grid item xs={12} lg={6}>
					<WrapperImage>
						<ItemImage item={item} />
					</WrapperImage>
				</Grid>

				<Grid item xs={12} lg={6}>
					<ItemInformation
						personalOffer={personalOffer}
						personalOrderSell={personalOrderSell}
						loadingPersonalOffer={isLoadingPersonalOffer}
						loadingPersonalOrderSell={isLoadingPersonalOrderSell}
						refetchApi={refetchApi}
					/>
				</Grid>
			</Grid>

			{/* Item detail tabs */}
			<Box sx={{ mt: 5 }}>
				<TabItemDetail listActivityPriceChart={listActivityPriceChart} />
			</Box>

			{/* More items from current item's collection */}
			<Box sx={{ mt: 5 }}>
				<Typography variant="h3" sx={{ textAlign: 'center', fontWeight: '700' }}>
					More from this collection
				</Typography>

				<Box sx={{ mt: 5 }}>
					<MoreItem collection={item?.collectionInfo} itemId={itemId} />
				</Box>
			</Box>
		</Container>
	);
};

export default ItemDetail;
