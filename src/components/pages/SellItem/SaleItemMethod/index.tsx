import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
//mui
import { Stack, Typography, useTheme } from '@mui/material';
// redux
import { useSelector } from 'react-redux';
import { selectNftItem } from 'redux/slices/nftItemByItemIdSlice';
import { selectAddress } from 'redux/slices/web3InfoSlice';
//styled
import { SellMethodBox, SellMethodWrapper } from './styled';
//image
import TagWhite from 'assets/icons/tag-white.webp';
import TicketWhite from 'assets/icons/ticket-white.webp';

import TagBlack from 'assets/icons/tag-black.webp';
import TicketBlack from 'assets/icons/ticket-black.webp';
//context
import { useSelling } from 'contexts/SellingContext';
//constant
import { ORDER_CONFIGURATION } from '../../../../constants';
// utils
import { tokenErcFunction } from 'utils';
// models
import { NFT } from 'models';

const { checkTokenContractStandard, getBlanceOfToken1155 } = tokenErcFunction();

function SellItemMethod() {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';

	//context
	const context = useSelling();
	const { state, dispatch } = context;
	const { saleKind } = state;

	// useSelector
	const item: NFT | null = useSelector(selectNftItem);
	const userAddress = useSelector(selectAddress);

	//Sale kind
	const FIXED = ORDER_CONFIGURATION.FIXED_PRICE;
	const DUTCH = ORDER_CONFIGURATION.DUTCH_AUCTION;

	// useEffect
	// check standard and max supply
	useEffect(() => {
		(async () => {
			if (!item || !item.collectionInfo || !userAddress) {
				return;
			}

			// check standard
			try {
				const standard: 'ERC1155' | 'ERC721' = await checkTokenContractStandard(
					item.collectionInfo.collectionAddress
				);

				if (standard.includes('1155')) {
					// set standard
					dispatch({ type: 'SET_IS_1155', value: true });

					// set max supply
					const maxSupply: number = await getBlanceOfToken1155(
						userAddress,
						item.collectionInfo.collectionAddress,
						item.itemTokenId
					);

					dispatch({ type: 'SET_MAX_SUPPLY', value: maxSupply });
				} else {
					// set standard
					dispatch({ type: 'SET_IS_1155', value: false });
				}
			} catch (error) {
				toast.error('Some error occur when track your item on blockchain!');
				console.log(error);
				return;
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, item]);

	// set saleKind
	const handleChangeSellingMethod = (newSaleKind: number) => {
		if (newSaleKind === saleKind) return;

		dispatch({ type: 'RESET_SELLING_STATE', value: null });
		dispatch({ type: 'SET_SALE_KIND', value: newSaleKind });
	};

	return (
		<Stack
			direction={{ xs: 'row', lg: 'column' }}
			justifyContent="center"
			alignItems="center"
			spacing={3}
		>
			<SellMethodWrapper>
				<SellMethodBox
					active={saleKind === FIXED ? true : false}
					onClick={() => handleChangeSellingMethod(FIXED)}
				>
					<img
						src={isLightTheme ? TagBlack : TagWhite}
						alt="tag price"
						width={30}
						height={30}
					/>
					<Typography variant="h5">Fixed price</Typography>
				</SellMethodBox>
			</SellMethodWrapper>

			<SellMethodWrapper>
				<SellMethodBox
					active={saleKind === DUTCH ? true : false}
					onClick={() => handleChangeSellingMethod(DUTCH)}
				>
					<img
						src={isLightTheme ? TicketBlack : TicketWhite}
						alt="ticket"
						width={35}
						height={25}
					/>
					<Typography variant="h5">Falling Price</Typography>
				</SellMethodBox>
			</SellMethodWrapper>
		</Stack>
	);
}
export default SellItemMethod;
