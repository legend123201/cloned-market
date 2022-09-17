import React, { useEffect, useRef } from 'react';
// mui
import { Box, Stack } from '@mui/material';
// components
import ActivityCard from 'components/CustomUI/Card/ActivityCard';
import SkeletonActivityList from 'components/CustomUI/Skeleton/List/SkeletonActivityList';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';
import { HistoryIdsByTxHash } from 'models';

export interface IInfiniteListActivityProps {
	listTokenId: any;
	isLoading: boolean;
	hasNextPage: boolean;
	fetchNextPage: Function;
	allowLoadMore: boolean;
}

export default function InfiniteListActivity({
	listTokenId,
	isLoading,
	hasNextPage,
	fetchNextPage,
	allowLoadMore,
}: IInfiniteListActivityProps) {
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
			<Stack spacing={2} ref={listRef}>
				{listTokenId.map((historyIdsByTxHash: HistoryIdsByTxHash, index: number) => {
					return <ActivityCard historyIdsByTxHash={historyIdsByTxHash} key={index} />;
				})}
				{isLoading && <SkeletonActivityList />}
			</Stack>

			{!isLoading && listTokenId && listTokenId.length === 0 && (
				<NoItemCircleCard title="No data yet!" image={ImageNoOffer} />
			)}
		</Box>
	);
}
