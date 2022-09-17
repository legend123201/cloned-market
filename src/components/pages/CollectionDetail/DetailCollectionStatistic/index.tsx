/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
// models
import { Collection } from 'models';
// mui, styled
import { Box, Typography, useTheme } from '@mui/material';
import { DetailStatistic, StatisticBox, StatisticNumber, StatisticTitle } from './styled';
// utils
import { formatNumber, formatNumberWithText } from 'utils';
// contexts
import { SizeContext } from 'contexts/SizeObserver';

export interface DetailCollectionStatisticProps {
	collection: Collection;
	sx?: any;
}

function DetailCollectionStatistic({ collection, sx }: DetailCollectionStatisticProps) {
	const theme = useTheme();
	const { innerWidth } = useContext(SizeContext);

	const listStatistic = [
		{ title: 'Items', number: formatNumberWithText(collection.items, 0, 2) },
		{ title: 'Owners', number: formatNumberWithText(collection.owners, 0, 2) },
		{ title: 'Floor Price', number: `$${formatNumberWithText(collection.floorPrice, 2)}` },
		{ title: 'Volume Traded', number: `$${formatNumberWithText(collection.volumeTrade, 2)}` },
	];

	return (
		<DetailStatistic sx={sx}>
			{innerWidth > theme.breakpoints.values.sm
				? listStatistic.map((item: any, index: number) => (
						<StatisticBox key={index}>
							<StatisticNumber variant="body1">{item.number}</StatisticNumber>
							<StatisticTitle variant="caption">{item.title}</StatisticTitle>
						</StatisticBox>
				  ))
				: listStatistic
						.map((item: any, index: number) => {
							if (index % 2 === 0) {
								return (
									<StatisticBox key={index}>
										<StatisticNumber variant="body1">
											{listStatistic[index].number}
										</StatisticNumber>
										<StatisticTitle variant="caption">
											{listStatistic[index].title}
										</StatisticTitle>

										<StatisticNumber variant="body1" sx={{ mt: 2 }}>
											{listStatistic[index + 1].number}
										</StatisticNumber>
										<StatisticTitle variant="caption">
											{listStatistic[index + 1].title}
										</StatisticTitle>
									</StatisticBox>
								);
							} else return null;
						})
						.filter((item: any) => item !== null)}
		</DetailStatistic>
	);
}

export default DetailCollectionStatistic;
