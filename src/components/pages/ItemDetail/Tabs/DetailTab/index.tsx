/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// redux
import { useSelector } from 'react-redux';
import { selectNftItem } from 'redux/slices/nftItemByItemIdSlice';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// mui
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ContractAddress, DetailTitle, TabWrapper } from './styled';
// constants
import { NETWORKINFO } from '../../../../../constants';
import { ETHERSCAN } from 'constants/etherscan.constant';
// componentss
import CopyToClipboardButton from 'components/CustomUI/CopyToClipboardButton';
// utils
import { sliceAddress, sliceString, tokenErcFunction } from 'utils';

const { checkTokenContractStandard, getBlanceOfToken1155 } = tokenErcFunction();

export interface IDetailTabProps {}

export default function DetailTab(props: IDetailTabProps) {
	const theme = useTheme();

	// useState
	const [ownedQuantity, setOwnedQuantity] = useState<number>(0);

	// useSelector
	const item = useSelector(selectNftItem);
	const userAddress = useSelector(selectAddress);

	// useEffect
	// check standard and quantity
	useEffect(() => {
		(async () => {
			if (!item || !item.collectionInfo || !userAddress) {
				return;
			}

			try {
				// check standard
				const standard: 'ERC1155' | 'ERC721' = await checkTokenContractStandard(
					item.collectionInfo.collectionAddress
				);

				if (standard.includes('1155')) {
					const ownedQuantity: number = await getBlanceOfToken1155(
						userAddress,
						item.collectionInfo.collectionAddress,
						item.itemTokenId
					);

					setOwnedQuantity(ownedQuantity);
				} else {
					if (item.owner.includes(userAddress)) {
						setOwnedQuantity(1);
					}
				}
			} catch (error) {
				toast.error('Some error occur when track your item on blockchain!');
				console.log(error);
				return;
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress, item]);

	return (
		<TabWrapper>
			<Stack direction="row" spacing={2}>
				{/* Title */}
				<DetailTitle spacing={1}>
					<Typography variant="body1">Contract Address:</Typography>
					<Typography variant="body1">Token ID:</Typography>
					<Typography variant="body1">Token Standard:</Typography>
					<Typography variant="body1">Blockchain:</Typography>
					<Typography variant="body1">Owned Quantity:</Typography>
				</DetailTitle>

				{/* Value */}
				<Stack spacing={1} sx={{ minWidth: 0 }}>
					<ContractAddress
						variant="body1"
						href={`${ETHERSCAN[item?.chainId ?? 4].url}address/${
							item?.collectionInfo?.collectionAddress
						}`}
						target="_blank"
						noWrap
					>
						{item?.collectionInfo?.collectionAddress}
					</ContractAddress>
					<Stack direction="row" spacing={1}>
						<Typography variant="body1">
							{sliceString(item?.itemTokenId ?? '', 15)}
						</Typography>
						<CopyToClipboardButton text={item?.itemTokenId} placementTooltip="top" />
					</Stack>
					<Typography variant="body1">{item?.itemStandard}</Typography>
					<Typography variant="body1">{NETWORKINFO[item?.chainId ?? 4].name}</Typography>
					<Typography variant="body1">{ownedQuantity}</Typography>
				</Stack>
			</Stack>
		</TabWrapper>
	);
}
