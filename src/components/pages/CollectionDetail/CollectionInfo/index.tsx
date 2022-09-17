/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
// ultis
import { renderImage, sliceAddress, isOurCollection1155Address, sliceString } from 'utils';
// model
import { Collection } from 'models';
// styled
import {
	InfoCollectionWrapper,
	InfoStack,
	CollectionName,
	CollectionInfo,
	MoreOptions,
	AvatarWrapper,
	InfoAddressList,
	InfoAddressItem,
	InfoAddress,
	CollectionDescription,
	ReadMoreButton,
	StyledSpanSecondary,
	StyledSpanSpecial,
	DropDownWrapper,
	DropDownOption,
	FeatureWrapper,
} from './styled';
// components
import DetailCollectionStatistic from '../DetailCollectionStatistic';
import CopyToClipboardButton from 'components/CustomUI/CopyToClipboardButton';
import DropDown from 'components/CustomUI/DropDown';
// mui
import { Avatar, Box, Stack, Tooltip, Typography } from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
//redux
import { useSelector } from 'react-redux';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
// constants
import { NETWORKINFO } from 'constants/etherscan.constant';
// path
import { PATH_COLLECTION } from 'routes/path';
// images
import HeartFullRed from 'assets/icons/heart-full-red.svg';
import { RELATED_URLS } from '../../../../constants';

export type InfoCollectionProps = {
	collection: Collection | null;
};

function InfoCollection({ collection }: InfoCollectionProps) {
	const { collectionId } = useParams();
	const navigate = useNavigate();

	// useState
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);
	const [isLoadMore, setIsLoadMore] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	// functions
	const isQualifiedToEdit = (): boolean => {
		if (
			collection &&
			chainId &&
			collection.userAddress === userAddress &&
			isOurCollection1155Address(collection.collectionAddress, chainId)
		) {
			return true;
		}
		return false;
	};

	const getBlockchainIcon = (chainId: number) => {
		const blockchain = NETWORKINFO[chainId];
		return (
			<Tooltip title={blockchain.name} placement="top" aria-describedby="tip1" arrow>
				<img
					loading="lazy"
					src={blockchain.image}
					alt="blockchain icon"
					width="30"
					height="30"
					style={{ cursor: 'pointer' }}
				/>
			</Tooltip>
		);
	};

	const renderButtonContent = () => {
		return (
			<Stack direction="row" alignItems="center" sx={{ padding: '8px', cursor: 'pointer' }}>
				<MoreHorizOutlinedIcon sx={{ width: '32px' }} />
			</Stack>
		);
	};

	const renderDropdownContent = () => {
		return (
			<DropDownWrapper>
				<DropDownOption variant="subtitle2">Refresh metadata</DropDownOption>
				<DropDownOption variant="subtitle2">
					<TwitterShareButton
						url={`${RELATED_URLS.MetaSpacecyHomePage}/#/${PATH_COLLECTION.detail}/${collection?._id}`}
						title={`Look what I found! Collection ${collection?.collectionName}`}
						// hashtags={['Music', 'Game']}
						via="MetaSpacecy"
						style={{ width: '100%', textAlign: 'left' }}
					>
						Share
					</TwitterShareButton>
				</DropDownOption>
				{/* Enable/Disable Report */}
				{/* <DropDownOption variant="subtitle2">Report</DropDownOption> */}
			</DropDownWrapper>
		);
	};

	return (
		<>
			<Stack
				alignItems="center"
				justifyContent="center"
				sx={{ pt: 12, maxWidth: '500px', margin: '0 auto' }}
			>
				{/* Collection name*/}
				<Stack direction="row" alignItems="center" spacing={1}>
					<CollectionName variant="h3">{collection?.collectionName}</CollectionName>

					{getBlockchainIcon(collection?.chainId ?? 4)}
				</Stack>

				{/* Collection creator */}
				<Typography variant="body2" sx={{ fontWeight: '600', mt: 1 }}>
					<StyledSpanSecondary>Created by</StyledSpanSecondary>{' '}
					<StyledSpanSpecial>
						{sliceAddress(collection?.userAddress, 6, 6)}
					</StyledSpanSpecial>
				</Typography>

				{/* Collection statistic */}
				{collection && <DetailCollectionStatistic collection={collection} sx={{ mt: 4 }} />}

				{/* Collection description */}
				<Typography variant="h6" sx={{ mt: 4 }}>
					{isLoadMore
						? collection?.description
						: sliceString(collection?.description ?? '', 100)}
				</Typography>

				{collection?.description && collection.description.length > 100 && !isLoadMore && (
					<ReadMoreButton
						variant="button"
						onClick={() => {
							setIsLoadMore(true);
						}}
					>
						Read more
					</ReadMoreButton>
				)}

				{isLoadMore && (
					<ReadMoreButton
						variant="button"
						onClick={() => {
							setIsLoadMore(false);
						}}
					>
						Show less
					</ReadMoreButton>
				)}

				{/* Collection features */}
				<Stack direction="row" alignItems="stretch" spacing={2} sx={{ mt: 2 }}>
					<FeatureWrapper sx={{ padding: '0 12px' }}>
						<img
							src={HeartFullRed}
							alt="icon heart"
							style={{ width: '20px', height: 'auto' }}
						/>
					</FeatureWrapper>

					<FeatureWrapper>
						<DropDown
							activeDropDown={activeDropDown}
							setActiveDropDown={setActiveDropDown}
							buttonContent={renderButtonContent()}
							dropdownContent={renderDropdownContent()}
							sx={{
								right: 0,
								bottom: 'unset',
								left: 'unset',
								top: '110%',
							}}
						/>
					</FeatureWrapper>
				</Stack>
			</Stack>

			{/* <InfoCollectionWrapper sx={{ mt: 100 }}>
				{collection && (
					<InfoStack alignItems="center">
						<CollectionInfo>
							<Stack direction="row" alignItems="center" spacing={1}>
								<CollectionName variant="h4">
									{collection?.collectionName}
								</CollectionName>

								{getBlockchainIcon(collection.chainId)}
							</Stack>

							<InfoAddressList sx={{ mt: 0 }}>
								<InfoAddressItem>
									<InfoAddress variant="body1">Collection address:</InfoAddress>
									<Stack direction="row">
										<InfoAddress variant="body1">
											{sliceAddress(collection.collectionAddress, 8, 5)}
										</InfoAddress>
										<CopyToClipboardButton
											text={collection.collectionAddress}
											placementTooltip="right"
										/>
									</Stack>
								</InfoAddressItem>

								<InfoAddressItem>
									<InfoAddress variant="body1">Owned by:</InfoAddress>
									<Stack direction="row">
										<InfoAddress variant="body1">
											{sliceAddress(collection.userAddress, 8, 5)}
										</InfoAddress>
										<CopyToClipboardButton
											text={collection.userAddress}
											placementTooltip="right"
										/>
									</Stack>
								</InfoAddressItem>
							</InfoAddressList>

							<Typography variant="body1" sx={{ mt: 3 }}>
								Royalties: {collection?.royalties}%
							</Typography>
						</CollectionInfo>

						<MoreOptions>
							<Stack direction="row">
								<TwitterShareButton
									url={`https://nftspacex.io/#/${PATH_COLLECTION.detail}/${collection._id}`}
									// url="https://nftspacex.io/#/detail/6273b63badcba59d78a9bc75"
									title={`Look what I found! Collection ${collection.collectionName}`}
									// hashtags={['Music', 'Game']}
									via="MetaSpacecy"
								>
									<Tooltip
										title={'Share'}
										placement="top"
										aria-describedby="tip1"
										arrow
									>
										<ShareIcon sx={{ ml: 2, cursor: 'pointer' }} />
									</Tooltip>
								</TwitterShareButton>

								{isQualifiedToEdit() && (
									<Tooltip
										title="Edit"
										placement="top"
										aria-describedby="tip1"
										arrow
									>
										<AppRegistrationIcon
											sx={{ ml: 2, cursor: 'pointer' }}
											onClick={() =>
												navigate(
													`${PATH_COLLECTION.editCollection}/${collectionId}`
												)
											}
										/>
									</Tooltip>
								)}
							</Stack>
						</MoreOptions>
					</InfoStack>
				)}
			</InfoCollectionWrapper> */}
		</>
	);
}

export default InfoCollection;
