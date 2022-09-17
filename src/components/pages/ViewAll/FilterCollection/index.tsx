/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// mui
import { Stack, Typography } from '@mui/material';
// styled
import { ButtonShow, FilterButton } from './styled';
// var
import { ListCategory } from 'components/pages/Home/CategoryList';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter, setFilter } from 'redux/slices/collectionSlice';
// hooks
import { useDebounce, useIsFirstRender } from 'hooks';

export interface IFilterCollectionProps {}

export default function FilterCollection(props: IFilterCollectionProps) {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const categoryParam: string | null = searchParams.get('category');

	// useState
	const [isShowMore, setIsShowMore] = useState<boolean>(false);
	const [currentCategoryId, setCurrentCategoryId] = useState<number | undefined>(undefined);

	// useSelector
	const filter = useSelector(selectFilter);

	// hook
	const isFirstRender = useIsFirstRender();
	const debouncedCategoryParam = useDebounce<string | null>(categoryParam, 500);

	// useEffect
	useEffect(() => {
		if (debouncedCategoryParam) {
			const categoryChoosen = ListCategory.find(
				(category: any) =>
					category.title.toLowerCase() === debouncedCategoryParam.toLowerCase()
			);

			dispatch(setFilter({ ...filter, category: [categoryChoosen?.id] }));
			setCurrentCategoryId(categoryChoosen?.id);
		} else {
			dispatch(setFilter({ ...filter, category: [] }));
			setCurrentCategoryId(undefined);
		}
	}, [debouncedCategoryParam]);

	console.log('currentCategoryId', currentCategoryId);

	return (
		<div>
			<Stack direction="row" alignItems="center" gap={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
				<FilterButton
					onClick={() => {
						setCurrentCategoryId(undefined);
						setSearchParams({});
					}}
					className={currentCategoryId === undefined ? 'active' : ''}
				>
					<Typography variant="body2">All</Typography>
				</FilterButton>

				{ListCategory.map((category: any, index: number) => {
					// just show 6 activity when !isShowMore
					if (!isShowMore && index > 4) return null;

					return (
						<FilterButton
							key={index}
							onClick={() => {
								if (currentCategoryId !== category.id) {
									setSearchParams({ category: category.title });
								}
							}}
							className={currentCategoryId === category.id ? 'active' : ''}
						>
							<Typography variant="body2">{category.title}</Typography>
						</FilterButton>
					);
				}).filter((item) => item !== null)}

				<ButtonShow
					variant="body1"
					onClick={() => {
						setIsShowMore(!isShowMore);
					}}
				>
					{isShowMore ? 'Less' : 'More'}
				</ButtonShow>
			</Stack>
		</div>
	);
}
