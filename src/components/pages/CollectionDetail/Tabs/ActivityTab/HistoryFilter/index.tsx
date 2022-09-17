/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
// mui
import { Button, Stack, Typography } from '@mui/material';
// styled
import { ButtonShow, FilterButton } from './styled';
// constant
import { TYPE_TRANSACTION } from '../../../../../../constants';
// hooks
import { useDebounce, useIsFirstRender } from 'hooks';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter, setFilter } from 'redux/slices/tradingSlice';
// contexts
import { SizeContext } from 'contexts/SizeObserver';

export interface IHistoryFilterProps {}

export default function HistoryFilter(props: IHistoryFilterProps) {
	const dispatch = useDispatch();
	const { innerWidth } = useContext(SizeContext);

	// useState
	const [currentHistoryType, setCurrentHistoryType] = useState<string | undefined>('');
	const [isShowMore, setIsShowMore] = useState<boolean>(false);

	// useSelector
	const filter = useSelector(selectFilter);

	// hook
	const isFirstRender = useIsFirstRender();
	const debouncedHistoryType = useDebounce<string | undefined>(currentHistoryType, 500);

	// vars
	const listHistoryType = Object.entries(TYPE_TRANSACTION);

	// useEffect
	useEffect(() => {
		if (innerWidth > 1200) {
			setIsShowMore(true);
		}
	}, []);

	useEffect(() => {
		if (isFirstRender) return;

		dispatch(setFilter({ ...filter, type: debouncedHistoryType }));
	}, [debouncedHistoryType]);

	return (
		<>
			<Typography variant="h4">FilterNft</Typography>

			<Stack direction="row" alignItems="center" gap={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
				{listHistoryType
					.map((historyType: [string, string], index: number) => {
						// just show 6 activity when !isShowMore
						if (!isShowMore && index > 4) return null;

						const [typeId, name] = historyType;

						return (
							<FilterButton
								key={index}
								onClick={() => {
									if (currentHistoryType === typeId) {
										setCurrentHistoryType(undefined);
									} else {
										setCurrentHistoryType(typeId);
									}
								}}
								className={currentHistoryType === typeId ? 'active' : ''}
							>
								<Typography variant="body2">{name}</Typography>
							</FilterButton>
						);
					})
					.filter((item) => item !== null)}

				<ButtonShow
					variant="body1"
					onClick={() => {
						setIsShowMore(!isShowMore);
					}}
				>
					{isShowMore ? 'Less' : 'More'}
				</ButtonShow>
			</Stack>
		</>
	);
}
