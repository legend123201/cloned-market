/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography } from '@mui/material';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { selectAuctionDetail } from 'redux/slices/auctionDetailByAuctionIdSlice';

export interface IAppProps {}

export default function DescriptionTab(props: IAppProps) {
	const auctionDetail = useSelector(selectAuctionDetail);
	// console.log('123', auctionDetail);
	return (
		<Fragment>
			<Typography mt={1}>{auctionDetail?.infoINO.descriptionINO}</Typography>
		</Fragment>
	);
}
