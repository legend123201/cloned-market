/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
// mui
import { Box, Typography } from '@mui/material';
// styled
import { Divider } from './Common/styled';
import { ResultTitle, GlobalSearchComponent, ButtonAllResults } from './styled';
// components
import GlobalSearchResultCard from 'components/CustomUI/Card/GlobalSearchResultCard';
import SkeletonGlobalResultList from 'components/CustomUI/Skeleton/List/SkeletonGlobalResultList';
// apis
import nftsApi from 'apis/nftsApi';
import collectionApi from 'apis/collectionApi';
import userApi from 'apis/userApi';
// contexts
import { SizeContext } from 'contexts/SizeObserver';
// utils
import GlobalSearchSmallScreen from './GlobalSearchSmallScreen';
import GlobalSearchBigScreen from './GlobalSearchBigScreen';
// hooks
import { useNavigateSearch } from 'hooks/useNavigateSearch';
// path
import { PATH_PAGE } from 'routes/path';
// models
import { ListResponse } from 'models';
// hooks
import { useDebounce } from 'hooks';

const GlobalSearch: React.FC = () => {
	const navigateSearchParams = useNavigateSearch();

	//useContext
	const { innerWidth } = useContext(SizeContext);

	// useState
	const [inputValue, setInputValue] = useState<string>('');

	const [isLoadingCollection, setIsLoadingCollection] = useState<boolean>(false);
	const [isLoadingItem, setIsLoadingItem] = useState<boolean>(false);
	const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

	const [listCollectionId, setListCollectionId] = useState<any>([]);
	const [listItemId, setListItemId] = useState<any>([]);
	const [listUserId, setListUserId] = useState<any>([]);

	// hooks
	const debouncedInputValue = useDebounce<string>(inputValue, 500);

	// vars
	const globalSearchBreakpoint = 600;

	// useEffect
	// fetch list collection id
	useEffect(() => {
		if (debouncedInputValue) {
			(async () => {
				setIsLoadingCollection(true);
				try {
					const res: ListResponse<any> = await collectionApi.getSearchListCollectionId(
						{ page: 1, pageSize: 3 },
						{ text: debouncedInputValue }
					);
					setListCollectionId(res.data);
					setIsLoadingCollection(false);
				} catch (error) {
					toast.error('Some error occurred while searching collection!');
					setIsLoadingCollection(false);
				}
			})();
		} else {
			setListCollectionId([]);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedInputValue]);

	// fetch list item id
	useEffect(() => {
		if (debouncedInputValue) {
			(async () => {
				setIsLoadingItem(true);
				try {
					const res: ListResponse<any> = await nftsApi.getSearchListTokenId(
						{ page: 1, pageSize: 3 },
						{ text: debouncedInputValue }
					);
					setListItemId(res.data);
					setIsLoadingItem(false);
				} catch (error) {
					toast.error('Some error occurred while searching item!');
					setIsLoadingItem(false);
				}
			})();
		} else {
			setListItemId([]);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedInputValue]);

	// fetch list user id
	useEffect(() => {
		if (debouncedInputValue) {
			(async () => {
				setIsLoadingUser(true);
				try {
					const res: ListResponse<any> = await userApi.getListUserById(
						{ page: 1, pageSize: 3 },
						{ text: debouncedInputValue }
					);
					setListUserId(res.data);
					setIsLoadingUser(false);
				} catch (error) {
					toast.error('Some error occurred while searching user!');
					setIsLoadingUser(false);
				}
			})();
		} else {
			setListUserId([]);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedInputValue]);

	// functions
	const handleOnChangeInputValue = (e: any) => {
		const newValue = e.target.value;
		setInputValue(newValue);
	};

	const RenderSearchResults = (deactivateDropdown: Function) => {
		return (
			<Box>
				<ResultTitle variant="body1">Collection</ResultTitle>

				{!isLoadingCollection ? (
					listCollectionId.length > 0 ? (
						<>
							{listCollectionId.map((item: any, index: number) => {
								return (
									<Box key={index}>
										<Divider />
										<GlobalSearchResultCard
											resultId={item._id}
											type="collection"
											deactivateDropdown={deactivateDropdown}
										/>
									</Box>
								);
							})}
						</>
					) : (
						<Typography variant="body2" sx={{ pl: 1, pb: 1 }}>
							No result
						</Typography>
					)
				) : (
					<SkeletonGlobalResultList />
				)}

				<Divider />
				<ResultTitle variant="body1">Item</ResultTitle>
				{!isLoadingItem ? (
					listItemId.length > 0 ? (
						<>
							{listItemId.map((item: any, index: number) => {
								return (
									<Box key={index}>
										<Divider />
										<GlobalSearchResultCard
											resultId={item._id}
											type="item"
											deactivateDropdown={deactivateDropdown}
										/>
									</Box>
								);
							})}
						</>
					) : (
						<Typography variant="body2" sx={{ pl: 1, pb: 1 }}>
							No result
						</Typography>
					)
				) : (
					<SkeletonGlobalResultList />
				)}

				<Divider />
				<ResultTitle variant="body1">Account</ResultTitle>
				{!isLoadingUser ? (
					listUserId.length > 0 ? (
						<>
							{listUserId.map((item: any, index: number) => {
								return (
									<Box key={index}>
										<Divider />
										<GlobalSearchResultCard
											resultId={item._id}
											type="user"
											deactivateDropdown={deactivateDropdown}
										/>
									</Box>
								);
							})}
						</>
					) : (
						<Typography variant="body2" sx={{ pl: 1, pb: 1 }}>
							No result
						</Typography>
					)
				) : (
					<SkeletonGlobalResultList />
				)}

				{/* <Divider /> */}
				{!(
					listCollectionId.length <= 0 &&
					listItemId.length <= 0 &&
					listUserId.length <= 0
				) && (
					<ButtonAllResults
						variant="body1"
						onClick={() => {
							navigateSearchParams(PATH_PAGE.viewAll, { query: inputValue });
							deactivateDropdown();
						}}
					>
						All results
					</ButtonAllResults>
				)}
			</Box>
		);
	};

	return (
		<GlobalSearchComponent>
			{innerWidth <= globalSearchBreakpoint && (
				<GlobalSearchSmallScreen
					inputValue={inputValue}
					handleOnChangeInputValue={handleOnChangeInputValue}
					RenderSearchResults={RenderSearchResults}
				/>
			)}

			{innerWidth > globalSearchBreakpoint && (
				<GlobalSearchBigScreen
					inputValue={inputValue}
					setInputValue={setInputValue}
					handleOnChangeInputValue={handleOnChangeInputValue}
					RenderSearchResults={RenderSearchResults}
				/>
			)}
		</GlobalSearchComponent>
	);
};

export default React.memo(GlobalSearch);
