/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
// mui
import { Box, Container } from '@mui/material';
// components
// redux
import { useSelector, useDispatch } from 'react-redux';
import { selectFilter, setFilter } from 'redux/slices/allNftsSlice';
// styled
import { AuctionHeader, Devider, SubAuctionHeader } from './styled';
import IGOcomponent from 'components/pages/IGO';

const IgoPage = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const dispatch = useDispatch();

	const [searchParams, setSearchParams] = useSearchParams();
	const query: string | null = searchParams.get('query');

	// Handle search name function

	const filter = useSelector(selectFilter);

	return (
		<Container maxWidth="xxl" sx={{ mt: 14 }}>
			<AuctionHeader>MetaSpacecy IGO</AuctionHeader>

			<Box sx={{ marginTop: '22px' }}>
				<IGOcomponent />
			</Box>
		</Container>
	);
};

export default IgoPage;
