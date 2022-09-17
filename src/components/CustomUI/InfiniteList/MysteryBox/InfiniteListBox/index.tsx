/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
// mui
import { Box, Grid, styled } from '@mui/material';
// components
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
import BoxCard from 'components/CustomUI/Card/MysteryBox/BoxCard';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';
import CustomSlider from 'components/CustomUI/CustomSlider';
import SkeletonBoxCard from 'components/CustomUI/Skeleton/Item/Mysterybox/SkeletonBoxCard';
import { SizeContext } from 'contexts/SizeObserver';

export interface InfiniteListBoxProps {
	listTokenId: any;
	isLoading: boolean;
	hasNextPage: boolean;
	fetchNextPage: Function;
	allowLoadMore: boolean;
}

export default function InfiniteListBox({
	listTokenId,
	isLoading,
	hasNextPage,
	fetchNextPage,
	allowLoadMore,
}: InfiniteListBoxProps) {
	const listRef = useRef<any>();
	const { innerWidth } = useContext(SizeContext);
	const [amountSkeleton, setAmountSkeleton] = useState<number>();
	useEffect(() => {
		// Handler to call on window scroll
		function handleScroll() {
			//Loadmore when scroll to the bottom of list
			if (allowLoadMore && hasNextPage && listRef.current) {
				const bottom = listRef.current.getBoundingClientRect().bottom;

				if (window.innerHeight > bottom - 300) {
					fetchNextPage();
				}
			}
		}
		// Add event listener
		window.addEventListener('scroll', handleScroll, { passive: true });
		// Call handler right away so state gets updated with initial window position
		handleScroll();
		// Remove event listener on cleanup
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasNextPage, allowLoadMore]);

	const listItem = () => {
		if (listTokenId) {
			return listTokenId.map((item: any, index: number) => (
				<BoxCard itemId={item} key={index} />
			));
		} else {
			return;
		}
	};

	const listItemSkeleton = () => {
		return new Array(6)
			.fill(null)
			.map((item: any, index: number) => <SkeletonBoxCard key={index} />);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box>
				{!isLoading ? (
					<CustomSlider
						slidesPerView={4}
						loop={false}
						spaceBetween={30}
						slidesPerGroup={1}
						centeredSlides={false}
						slidesToShowPoint1358={4}
						slidesToShowPoint1093={2.5}
						slidesToShowPoint828={2}
						slidesToShowPoint547={1.5}
						slidesToShowPoint320={1}
						slidesToShowPoint0={1}
						renderItem={listItem()}
					/>
				) : (
					<CustomSlider
						slidesPerView={4}
						loop={false}
						spaceBetween={30}
						slidesPerGroup={1}
						centeredSlides={false}
						slidesToShowPoint1358={4}
						slidesToShowPoint1093={2.5}
						slidesToShowPoint828={2}
						slidesToShowPoint547={1.5}
						slidesToShowPoint320={1}
						slidesToShowPoint0={1}
						renderItem={listItemSkeleton()}
					/>
				)}
			</Box>

			{!isLoading && listTokenId && listTokenId.length === 0 && (
				<NoItemCircleCard title="No data yet!" image={ImageNoOffer} />
			)}
		</Box>
	);
}
