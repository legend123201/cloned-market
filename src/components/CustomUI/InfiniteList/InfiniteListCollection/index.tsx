import React, { useEffect, useRef } from 'react';
// mui
import { Box, useTheme } from '@mui/material';
// components
import CollectionCard from 'components/CustomUI/Card/CollectionCard';
import SkeletonCollectionList from 'components/CustomUI/Skeleton/List/SkeletonCollectionList';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';

export interface InfiniteListCollectionProps {
	listTokenId: any;
	isLoading: boolean;
	hasNextPage: boolean;
	fetchNextPage: Function;
	allowLoadMore: boolean;
}

export default function InfiniteListCollection({
	listTokenId,
	isLoading,
	hasNextPage,
	fetchNextPage,
	allowLoadMore,
}: InfiniteListCollectionProps) {
	const listRef = useRef<any>();
	const theme = useTheme();
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
			<Box
				sx={{
					marginTop: '20px',
					display: 'grid',
					gridTemplateColumns: 'repeat(4, 1fr)',
					gap: '32px',
					[theme.breakpoints.down(1350)]: {
						gridTemplateColumns: 'repeat(3, 1fr)',
					},
					[theme.breakpoints.down(1000)]: {
						gridTemplateColumns: 'repeat(2, 1fr)',
					},
					[theme.breakpoints.down(600)]: {
						gridTemplateColumns: 'repeat(1, 1fr)',
					},
				}}
				ref={listRef}
			>
				{listTokenId.map((item: any, index: number) => {
					return <CollectionCard key={index} collectionId={item._id ?? item} />;
				})}
				{isLoading && <SkeletonCollectionList />}
			</Box>

			{!isLoading && listTokenId && listTokenId.length === 0 && (
				<NoItemCircleCard title="No data yet!" image={ImageNoOffer} />
			)}
		</Box>
	);
}
