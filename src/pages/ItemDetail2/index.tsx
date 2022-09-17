/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// redux
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from 'redux/slices/nftItemByItemIdSlice';
import { selectNftItem } from 'redux/slices/nftItemByItemIdSlice';
import { selectChainId, selectAddress } from 'redux/slices/web3InfoSlice';
import { selectFilter } from 'redux/slices/orderSlice';
//actions
import { fetchDetailNftItemById } from 'redux/actions/nftItemByItemIdAction';
import { fetchListPaymentTokenByChainId } from 'redux/actions/tokenPaymentAction';
import { fetchListOrderOffer } from 'redux/actions/orderAction';
import { fetchTradingHistoryByNFTsId } from 'redux/actions/tradingAction';
import { fetchListOrderSell } from 'redux/actions/listOrderSellAction';
// models
import { ListResponseNonPaging, NFT, OrderResponseAPI, PriceActivity, Response } from 'models';
// mui
import { Container, Grid, Box, useTheme, Stack } from '@mui/material';
// api
import orderApi from 'apis/orderApi';
import historyApi from 'apis/historyApi';
// components
import Loading from 'components/CustomUI/LoadingPage';
import ItemImage2 from 'components/pages/ItemDetail2/ItemImage2';
import DescriptionTab from 'components/pages/ItemDetail/Tabs/DescriptionTab';
import ListingTab from 'components/pages/ItemDetail/Tabs/ListingTab';
import OfferTab from 'components/pages/ItemDetail/Tabs/OfferTab';
import TradingHistory from 'components/pages/ItemDetail/TradingHistory';
import MoreItem from 'components/pages/ItemDetail/MoreItem';
import BasicInfo from 'components/pages/ItemDetail2/BasicInfo';
import ItemInfoTab from 'components/pages/ItemDetail/Tabs/ItemInfoTab';
import ExpandCard from 'components/pages/ItemDetail/ExpandCard';
// utils
import { compareDate, timestampToDate } from 'utils';
// constants
import { ORDER_TYPE } from '../../constants';
// styled
import { WrapperImage } from './styled';
// images
import DescriptionBlack from 'assets/icons/description-black.webp';
import DescriptionWhite from 'assets/icons/description-white.webp';
import IconGraphWhite from 'assets/icons/graph-white.webp';
import IconGraphBlack from 'assets/icons/graph-black.webp';
import ImageNoOffer from 'assets/icons/no-offers.webp';
import IconCollectionWhite from 'assets/icons/collection-white.webp';
import IconCollectionBlack from 'assets/icons/collection-black.webp';

import { SizeContext } from 'contexts/SizeObserver';
declare let window: any;

const Detail = () => {
	const { itemId } = useParams();
	const dispatch = useDispatch();
	const theme = useTheme();
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

	// Check width
	const { innerWidth } = useContext(SizeContext);

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

	// fetch history of the item
	useEffect(() => {
		if (chainId && itemId) {
			dispatch(
				fetchTradingHistoryByNFTsId(
					itemId,
					{ page: 1, pageSize: 9999 },
					{},
					true,
					executeAfterFetchHistoryOfItem
				)
			);
		}
	}, [dispatch, itemId, chainId, stateRefetchApi, itemId]);

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

	const executeAfterFetchHistoryOfItem = (globalStateNewest: RootState) => {
		const { tradeHistory } = globalStateNewest;
		if (!tradeHistory.isSuccess) {
			toast.error('Can not fetch histories of this item!');
		}
	};

	const renderItemDetail = () => {
		if (innerWidth > 1200) {
			return (
				<Container maxWidth="xl" sx={{ mt: 5 }}>
					<Grid container spacing={10}>
						<Grid item xs={12} lg={6}>
							<Stack spacing={8}>
								<WrapperImage>
									<ItemImage2 item={item} />
								</WrapperImage>

								<Box>
									<ExpandCard
										title="Detail"
										icon={isLightTheme ? DescriptionBlack : DescriptionWhite}
										alt="trading-icon"
									>
										<Box sx={{ mt: 2 }}>
											<DescriptionTab />
										</Box>
									</ExpandCard>
								</Box>
							</Stack>
						</Grid>
						<Grid item xs={12} lg={6}>
							<Stack spacing={8}>
								<Box>
									{/* <BasicInfo item={item} /> */}
									<ItemInfoTab
										item={item}
										personalOffer={personalOffer}
										personalOrderSell={personalOrderSell}
										loadingPersonalOffer={isLoadingPersonalOffer}
										loadingPersonalOrderSell={isLoadingPersonalOrderSell}
										refetchApi={refetchApi}
									/>
								</Box>

								<Box>
									<ExpandCard
										title="Listings"
										icon={isLightTheme ? DescriptionBlack : DescriptionWhite}
										alt="trading-icon"
									>
										<Box sx={{ mt: 2 }}>
											<ListingTab />
										</Box>
									</ExpandCard>
								</Box>

								<Box>
									<ExpandCard
										title="Offers"
										icon={isLightTheme ? DescriptionBlack : DescriptionWhite}
										alt="trading-icon"
									>
										<Box sx={{ mt: 2 }}>
											<OfferTab />
										</Box>
									</ExpandCard>
								</Box>
							</Stack>
						</Grid>
					</Grid>

					{item && (
						<Box sx={{ mt: 5 }}>
							<ExpandCard
								title="Item Activity"
								icon={isLightTheme ? IconGraphBlack : IconGraphWhite}
								alt="trading-icon"
							>
								<TradingHistory />
							</ExpandCard>
						</Box>
					)}

					{itemId && (
						<Box sx={{ mt: 5 }}>
							<ExpandCard
								title="More from this collection"
								icon={isLightTheme ? IconCollectionBlack : IconCollectionWhite}
								alt="more-icon"
							>
								<MoreItem collection={item?.collectionInfo} itemId={itemId} />
							</ExpandCard>
						</Box>
					)}
				</Container>
			);
		} else {
			return (
				<Container maxWidth="xl" sx={{ mt: 5 }}>
					<Grid container spacing={10}>
						<Grid item xs={12} lg={6}>
							<Stack spacing={8}>
								<WrapperImage>
									<ItemImage2 item={item} />
								</WrapperImage>
							</Stack>
						</Grid>
						<Grid item xs={12} lg={6}>
							<Stack spacing={8}>
								<Box>
									{/* <BasicInfo item={item} /> */}
									<ItemInfoTab
										item={item}
										personalOffer={personalOffer}
										personalOrderSell={personalOrderSell}
										loadingPersonalOffer={isLoadingPersonalOffer}
										loadingPersonalOrderSell={isLoadingPersonalOrderSell}
										refetchApi={refetchApi}
									/>
								</Box>
								<Box>
									<ExpandCard
										title="Detail"
										icon={isLightTheme ? DescriptionBlack : DescriptionWhite}
										alt="trading-icon"
									>
										<Box sx={{ mt: 2 }}>
											<DescriptionTab />
										</Box>
									</ExpandCard>
								</Box>
								<Box>
									<ExpandCard
										title="Listings"
										icon={isLightTheme ? DescriptionBlack : DescriptionWhite}
										alt="trading-icon"
										initialExpandState={false}
									>
										<Box sx={{ mt: 2 }}>
											<ListingTab />
										</Box>
									</ExpandCard>
								</Box>
							</Stack>
						</Grid>
					</Grid>
					<Box sx={{ mt: 5 }}>
						<ExpandCard
							title="Offers"
							icon={isLightTheme ? DescriptionBlack : DescriptionWhite}
							alt="trading-icon"
							initialExpandState={false}
						>
							<Box sx={{ mt: 2 }}>
								<OfferTab />
							</Box>
						</ExpandCard>
					</Box>
					{item && (
						<Box sx={{ mt: 5 }}>
							<ExpandCard
								title="Item Activity"
								icon={isLightTheme ? IconGraphBlack : IconGraphWhite}
								alt="trading-icon"
								initialExpandState={false}
							>
								<TradingHistory />
							</ExpandCard>
						</Box>
					)}
					{itemId && (
						<Box sx={{ mt: 5 }}>
							<ExpandCard
								title="More from this collection"
								icon={isLightTheme ? IconCollectionBlack : IconCollectionWhite}
								alt="more-icon"
								initialExpandState={false}
							>
								<MoreItem collection={item?.collectionInfo} itemId={itemId} />
							</ExpandCard>
						</Box>
					)}
				</Container>
			);
		}
	};

	return <>{isLoadingItem || isDeletingOrderExpired ? <Loading /> : renderItemDetail()}</>;
};

export default Detail;
