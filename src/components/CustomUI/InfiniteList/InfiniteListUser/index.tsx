import React, { useEffect, useRef } from 'react';
// mui
import { Box, Grid } from '@mui/material';
// components
import UserCard from 'components/CustomUI/Card/UserCard';
import SkeletonUserList from 'components/CustomUI/Skeleton/List/SkeletonUserList';
import NoItemCircleCard from 'components/CustomUI/Card/NoItemCard/NoItemCircleCard';
// images
import ImageNoOffer from 'assets/icons/no-offers.webp';

export interface IInfiniteListUserProps {
	listTokenId: any;
	isLoading: boolean;
	hasNextPage: boolean;
	fetchNextPage: Function;
	allowLoadMore: boolean;
}

export default function InfiniteListUser({
	listTokenId,
	isLoading,
	hasNextPage,
	fetchNextPage,
	allowLoadMore,
}: IInfiniteListUserProps) {
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
							<UserCard currentUserAddress={item.userAddress} />
						</Grid>
					);
				})}
				{isLoading && <SkeletonUserList />}
			</Grid>

			{!isLoading && listTokenId && listTokenId.length === 0 && (
				<NoItemCircleCard title="No data yet!" image={ImageNoOffer} />
			)}
		</Box>
	);
}
