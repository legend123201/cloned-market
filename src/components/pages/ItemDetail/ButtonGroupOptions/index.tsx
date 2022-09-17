/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
import { toast } from 'react-toastify';
// mui
import { Button, Tooltip, useTheme } from '@mui/material';
// styled
import { ButtonGroupStyle } from './styled';
// icons
import IconShareWhite from 'assets/icons/share-white.webp';
import IconFlagWhite from 'assets/icons/flag-white.webp';
import IconEditWhite from 'assets/icons/edit-white.webp';

import IconShareBlack from 'assets/icons/share-black.webp';
import IconFlagBlack from 'assets/icons/flag-black.webp';
import IconEditBlack from 'assets/icons/edit-black.webp';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
import { selectNftItem, selectLoading } from 'redux/slices/nftItemByItemIdSlice';
// models
import { NFT } from 'models';
// components
import ButtonFreeze from '../ExecuteModal/ModalFreeze';
// path
import { PATH_ITEM } from 'routes/path';
// utils
import { tokenErcFunction } from 'utils';
// constant
import { RELATED_URLS } from '../../../../constants';

const { isHoldingAllItemQuantity } = tokenErcFunction();

export interface IButtonGroupOptionsProps {
	itemId: string;
	itemName: string;
	refetchApi: Function;
}

export default function ButtonGroupOptions({
	itemId,
	itemName,
	refetchApi,
}: IButtonGroupOptionsProps) {
	const theme = useTheme();
	const navigate = useNavigate();
	const isLightTheme = theme.palette.mode === 'light';

	// useState
	const [isOwnedAllQuantityErc1155, setIsOwnedAllQuantityErc1155] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const item: NFT | null = useSelector(selectNftItem);
	const isLoadingItem = useSelector(selectLoading);

	// useEffect
	// check isOwnedAllQuantityTemp
	useEffect(() => {
		(async () => {
			if (!userAddress || !item || !item.collectionInfo) return;

			try {
				if (item.itemStandard.includes('1155')) {
					const isOwnedAllQuantityTemp = await isHoldingAllItemQuantity(
						userAddress,
						item.chainId,
						item.collectionInfo.collectionAddress,
						item.itemTokenId
					);

					setIsOwnedAllQuantityErc1155(isOwnedAllQuantityTemp);
				}
			} catch (error) {
				console.log(error);
				toast.error('Some error occurred when checking isOwnedAllQuantityTemp!');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// functions
	const isQualifiedToEdit = () => {
		if (
			item &&
			userAddress &&
			item.owner.includes(userAddress) &&
			userAddress === item.creator &&
			!item.isFreeze && // erc721 will return at this condition
			isOwnedAllQuantityErc1155
		) {
			return true;
		}
		return false;
	};

	const isQualifiedToFreeze = (): boolean => {
		if (
			!isLoadingItem &&
			item &&
			item.isFreeze === false && // unfreezed item is definitely in our collection 1155 (erc721 will return at this condition)
			userAddress &&
			userAddress === item.creator &&
			isOwnedAllQuantityErc1155
		) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<ButtonGroupStyle variant="outlined" aria-label="outlined button group">
			<TwitterShareButton
				url={`${RELATED_URLS.MetaSpacecyHomePage}/#/detail/${itemId}`}
				title={`Look what I found! ${itemName} collectible`}
				hashtags={['Music', 'Game']}
				via="MetaSpacecy"
				style={{
					border: '1px solid',
					padding: '8px',
					borderTopLeftRadius: '10px',
					borderBottomLeftRadius: '10PX',
				}}
			>
				<Tooltip title="Share" arrow placement="top">
					{isLightTheme ? (
						<img src={IconShareBlack} alt="share icon" width={20} height={20} />
					) : (
						<img src={IconShareWhite} alt="share icon" width={20} height={20} />
					)}
				</Tooltip>
			</TwitterShareButton>
			{/* Enable/Disable Report */}
			{/* <Button>
				<Tooltip title="Report" arrow placement="top">
					{isLightTheme ? (
						<img src={IconFlagBlack} alt="flag icon" width={20} height={20} />
					) : (
						<img src={IconFlagWhite} alt="flag icon" width={20} height={20} />
					)}
				</Tooltip>
			</Button> */}

			{/* {isQualifiedToFreeze() && <ButtonFreeze refetchApi={refetchApi} />} */}

			{isQualifiedToEdit() && (
				<Button
					onClick={() => {
						navigate(`${PATH_ITEM.editItem}/${item!._id}`);
					}}
				>
					<Tooltip title="Edit item" arrow placement="top">
						{isLightTheme ? (
							<img src={IconEditBlack} alt="edit icon" width={18} height={18} />
						) : (
							<img src={IconEditWhite} alt="edit icon" width={18} height={18} />
						)}
					</Tooltip>
				</Button>
			)}
		</ButtonGroupStyle>
	);
}
