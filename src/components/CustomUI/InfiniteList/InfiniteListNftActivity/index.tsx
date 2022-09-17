/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from 'react';
// mui
import { Box, styled } from '@mui/material';
// components
import UserActivityCard from '../../Card/NftActivityCard';
import SkeletonNftActivityList from 'components/CustomUI/Skeleton/List/SkeletonNftActivityList';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';
// styled
import { TabWrapper } from './styled';
// models
import { HistoryIdsByTxHash } from 'models';

export interface InfiniteListNftActivityProps {
	listTokenId: any;
	isLoading: boolean;
	hasNextPage: boolean;
	fetchNextPage: Function;
	allowLoadMore: boolean;
}

const BoxGrid = styled(Box)(({ theme }) => ({
	boxSizing: 'border-box',
	display: 'grid',
	// gridAutoFlow: 'row',
	gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
	// gridTemplateColumns: 'repeat(5 ,1fr)',
	gap: 15,

	// [theme.breakpoints.between(300, 550)]: {
	// 	gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
	// },
}));

export default function InfiniteListNftActivity({
	listTokenId,
	isLoading,
	hasNextPage,
	fetchNextPage,
	allowLoadMore,
}: InfiniteListNftActivityProps) {
	const listRef = useRef<any>();

	useEffect(() => {
		const listRefCurrent = listRef.current;

		// Handler to call on window scroll
		function handleScroll() {
			//Loadmore when scroll to the bottom of list
			if (allowLoadMore && hasNextPage && listRefCurrent) {
				if (
					listRefCurrent.scrollTop + listRefCurrent.clientHeight ===
					listRefCurrent.scrollHeight
				) {
					fetchNextPage();
				}
			}
		}
		// Add event listener
		listRefCurrent.addEventListener('scroll', handleScroll, { passive: true });
		// Call handler right away so state gets updated with initial window position
		handleScroll();
		// Remove event listener on cleanup
		return () => {
			listRefCurrent.removeEventListener('scroll', handleScroll);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasNextPage, allowLoadMore]);

	return (
		<Box sx={{ width: '100%' }}>
			<TabWrapper ref={listRef}>
				{listTokenId.map((historyIdsByTxHash: HistoryIdsByTxHash, index: number) => {
					return <UserActivityCard historyIdsByTxHash={historyIdsByTxHash} key={index} />;
				})}
				{isLoading && <SkeletonNftActivityList />}

				{!isLoading && listTokenId && listTokenId.length === 0 && (
					<NoItemCircleCard title="No data yet!" image={ImageNoOffer} />
				)}
			</TabWrapper>
		</Box>
	);
}
