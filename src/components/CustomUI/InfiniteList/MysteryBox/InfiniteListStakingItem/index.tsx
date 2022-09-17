/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
// mui
import { Box, Grid, styled } from '@mui/material';
// components
import SkeletonStakingItemCardList from 'components/CustomUI/Skeleton/List/MysteryBox/SkeletonStakingItemCardList';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
import StakingItemCard from 'components/CustomUI/Card/MysteryBox/StankingItemCard';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';

export interface InfiniteListAssetBoxProps {
	listTokenId: any;
	isLoading: boolean;
	hasNextPage: boolean;
	fetchNextPage: Function;
	allowLoadMore: boolean;
}

export default function InfiniteListAssetBox({
	listTokenId,
	isLoading,
	hasNextPage,
	fetchNextPage,
	allowLoadMore,
}: InfiniteListAssetBoxProps) {
	const listRef = useRef<any>();

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

	return (
		<Box sx={{ width: '100%' }}>
			<Grid
				container
				spacing={4}
				columns={{ xs: 1, md: 2, lg: 3 }}
				sx={{ marginTop: '20px' }}
				ref={listRef}
			>
				{listTokenId.map((item: any, index: number) => {
					return (
						<Grid item xs={1} key={index}>
							{/* <StakingItemCard
								currentSelectedSlot={null}
								setCurrentSelectedSlot={() => {}}
								slotId={item}
								key={index}
							/> */}
						</Grid>
					);
				})}
				{isLoading && <SkeletonStakingItemCardList />}
			</Grid>

			{!isLoading && listTokenId && listTokenId.length === 0 && (
				<NoItemCircleCard title="No data yet!" image={ImageNoOffer} />
			)}
		</Box>
	);
}
