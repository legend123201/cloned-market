/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
// mui
import { Box } from '@mui/material';
// component
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
import CustomSlider from 'components/CustomUI/CustomSlider';
import NFTItemCard from 'components/CustomUI/Card/NFTItemCard';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { resetAll, selectListNft } from 'redux/slices/collectionItemSlice';
// actions
import { fetchNFTsByCollectionId } from 'redux/actions/collectionItemAction';
// models
import { Collection } from 'models';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';

export interface IMoreItemProps {
	itemId: string | undefined;
	collection: Collection | null | undefined;
}

export default function MoreItem({ collection, itemId }: IMoreItemProps) {
	const dispatch = useDispatch();
	// useSelector
	const listTokenId = useSelector(selectListNft);

	// fetch only 20 items from current collection
	// isFirstLoad === true
	useEffect(() => {
		if (collection) {
			dispatch(
				fetchNFTsByCollectionId(
					collection._id!,
					collection.chainId,
					{ page: 1, pageSize: 20 },
					{},
					true,
					executeAfterFetchNFTsByCollectionId
				)
			);
		}

		return () => {
			dispatch(resetAll());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collection]);

	// function
	const executeAfterFetchNFTsByCollectionId = (globalStateNewest: RootState) => {
		const { collectionItem } = globalStateNewest;
		console.log(collectionItem);
		if (!collectionItem.isSuccess) {
			toast.error(collectionItem.errorMessage);
		}
	};

	const renderListItem = () => {
		return listTokenId
			.filter((item: any) => {
				return item._id !== itemId;
			})
			.map((item: any, idx: number) => {
				return <NFTItemCard key={idx} itemId={item} />;
			});
	};

	return (
		<Box sx={{ mt: '20px' }}>
			{listTokenId.length > 1 ? (
				<>
					<CustomSlider
						slidesPerView={4}
						loop={false}
						spaceBetween={2}
						slidesPerGroup={1}
						centeredSlides={false}
						slidesToShowPoint1358={4}
						slidesToShowPoint1093={3}
						slidesToShowPoint828={3}
						slidesToShowPoint547={3}
						slidesToShowPoint320={1}
						slidesToShowPoint0={1}
						renderItem={renderListItem()}
					/>
				</>
			) : (
				<Box sx={{ mt: 5, width: '100%' }}>
					<NoItemCircleCard title="No items left!" image={ImageNoOffer} />
				</Box>
			)}
		</Box>
	);
}
