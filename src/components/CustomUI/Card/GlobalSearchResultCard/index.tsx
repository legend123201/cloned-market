/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// mui
import { Avatar, Box, Typography } from '@mui/material';
// components
import SkeletonGlobalSearchResultCard from 'components/CustomUI/Skeleton/Item/SkeletonGlobalSearchResultCard';
// styled
import { ResultItem } from './styled';
// utils
import { sliceAddress } from 'utils';
// apis
import nftsApi from 'apis/nftsApi';
import collectionApi from 'apis/collectionApi';
import userApi from 'apis/userApi';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// path
import { PATH_COLLECTION, PATH_ITEM, PATH_PAGE } from 'routes/path';
// models
import { Response, User } from 'models';
// hooks
import { useIsMounted } from 'hooks';

interface SearchResult {
	image: string;
	info1: string;
	info2: string;
	src: string;
}

export interface IGlobalSearchResultCardProps {
	resultId: string;
	type: 'collection' | 'item' | 'user';
	deactivateDropdown: Function;
}

export default function GlobalSearchResultCard({
	resultId,
	type,
	deactivateDropdown,
}: IGlobalSearchResultCardProps) {
	const navigate = useNavigate();

	// hooks
	const isMounted = useIsMounted();

	// useState
	const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);

	// useEffect
	useEffect((): any => {
		(async () => {
			setIsLoading(true);

			try {
				if (type === 'collection') {
					const res: Response<any> = await collectionApi.getSearchCollectionById(
						resultId
					);

					if (isMounted()) {
						setSearchResult({
							image: res.data.logo,
							info1: res.data.collectionName,
							info2: sliceAddress(res.data.collectionAddress, 6, 5) ?? '',
							src: `${PATH_COLLECTION.detail}/${res.data._id}`,
						});
					}
				} else if (type === 'item') {
					const res: Response<any> = await nftsApi.getSearchNftItemById(resultId);

					console.log(res.data);

					if (isMounted()) {
						setSearchResult({
							image: res.data.itemMedia,
							info1: res.data.itemName,
							info2: sliceAddress(res.data.itemTokenId, 6, 5) ?? '',
							src: `${PATH_ITEM.detail}/${res.data._id}`,
						});
					}
				} else {
					const res: Response<User> = await userApi.getSearchUser(resultId);

					if (isMounted()) {
						setSearchResult({
							image: res.data.avatar,
							info1: res.data.username,
							info2: sliceAddress(res.data.userAddress, 6, 5) ?? '',
							src:
								userAddress === res.data.userAddress
									? `${PATH_PAGE.user}`
									: `${PATH_PAGE.otherUser}/${res.data.userAddress}`,
						});
					}
				}
			} catch (error) {
				console.log(error);
			} finally {
				if (isMounted()) {
					setIsLoading(false);
				}
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return !isLoading ? (
		searchResult ? (
			<ResultItem
				onClick={() => {
					deactivateDropdown();
					navigate(searchResult.src);
				}}
			>
				<Avatar
					src={searchResult.image}
					alt="collection logo"
					sx={{ width: '40px', height: '40px' }}
				/>
				<Box>
					<Typography variant="body1">{searchResult.info1}</Typography>
					<Typography variant="body2" sx={{ opacity: 0.5 }}>
						{searchResult.info2}
					</Typography>
				</Box>
			</ResultItem>
		) : (
			<></>
		)
	) : (
		<SkeletonGlobalSearchResultCard />
	);
}
