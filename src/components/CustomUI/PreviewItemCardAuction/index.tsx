/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { FieldTitleName } from 'components/Form/FormAddOrEditCollection/styled';
import React from 'react';
import {
	ButtonWhiteBlur,
	ImageBlockchain,
	ItemCardStyle,
	ItemImage,
	MediaWrapperAuction,
	PriceChangeStyle,
	PriceStyle,
} from '../Card/NFTItemCardInAuction/styled';
import { CountItem, EmptyContent, PreviewItemWrapper, TopSlashLayout } from './styled';
import LazyImageNFT from '../LazyImages/LazyImage';
import { TwitterShareButton } from 'react-share';
import CountDown from '../Card/NFTItemCardInAuction/CountDown';

// image
import IconTwitterWhite from 'assets/icons/twitter-white.webp';
import IconFavoriteThinWhite from 'assets/icons/favorite-thin-white.webp';
import IconTwitterBlack from 'assets/icons/twitter-black.webp';
import IconFavoriteThinBlack from 'assets/icons/favorite-thin-black.webp';
import { getFileType } from 'utils';
import ReactPlayer from 'react-player/lazy';
// constants
import { RELATED_URLS } from '../../../constants';

export interface IAppProps {
	itemInfo?: any;
	tokenPaymentInfo?: any;
	itemPrice?: any;
	endTime?: any;
}

export default function PreviewItemCardAuction({
	itemInfo,
	tokenPaymentInfo,
	itemPrice,
	endTime,
}: IAppProps) {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';
	// Render Css for button toggle when hover
	const css = `
		.BidPlace {
			display: none;
		}
		.ButtonWhiteBlur:hover .BidPlace {
			display: block;
		}
		.ButtonWhiteBlur:hover .css-12d2mry {
			display: none;
		}
        `;

	const renderMedia = (item: any) => {
		const index = item[0].itemMedia.lastIndexOf('.');
		const length = item[0].itemMedia.length;

		const type = item[0].itemMedia.slice(index + 1, length);

		console.log('index length type', index, length, type);
		if (type === 'mp4') {
			return (
				<MediaWrapperAuction>
					<ReactPlayer
						url={item[0].itemMedia}
						className="react-player"
						muted={false}
						playing={false}
						loop={true}
						width="100%"
						height="100%"
						controls={true}
					/>
				</MediaWrapperAuction>
			);
		} else {
			return (
				<LazyImageNFT
					src={itemInfo[0].itemMedia}
					alt="item"
					style={{ borderRadius: '10px' }}
				/>
			);
		}
	};

	// console.log('props', tokenPaymentInfo);
	// console.log('itemInfo', itemInfo[0].itemMedia);

	return (
		<Box sx={{ marginTop: '40px' }}>
			{itemInfo.length === 0 ? (
				<Box>
					<FieldTitleName sx={{ paddingBottom: '24px' }}>
						Preview your Auction item
					</FieldTitleName>
					{/* <PreviewItemWrapper> */}
					<ItemCardStyle>
						<Box sx={{ p: 1.5 }}>
							<EmptyContent>
								<Typography>Upload file to preview your NFT</Typography>
							</EmptyContent>
						</Box>
					</ItemCardStyle>
					{/* </PreviewItemWrapper> */}
				</Box>
			) : (
				<Box>
					<FieldTitleName sx={{ paddingBottom: '24px' }}>
						Preview your Auction item
					</FieldTitleName>
					<PreviewItemWrapper position="relative">
						<ItemCardStyle>
							<Box sx={{ p: 1.5 }}>
								<ItemImage>
									{renderMedia(itemInfo)}
									{/* <LazyImageNFT
										src={itemInfo[0].itemMedia}
										alt="item"
										style={{ borderRadius: '10px' }}
									/> */}
								</ItemImage>
								<Box sx={{ width: '100%', height: '100%', py: 1 }}>
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="space-between"
										spacing={1}
									>
										<Box sx={{ width: '70%' }}>
											<Typography variant="h6" noWrap>
												{itemInfo[0].itemName}
											</Typography>
										</Box>

										<Tooltip
											title="Tooltip"
											placement="top"
											aria-describedby="tip1"
											arrow
										>
											<ImageBlockchain>
												<img
													src={`${RELATED_URLS.MetaSpacecyHomePage}/static/media/eth.b4d72611.webp`}
													alt="icon blockchain"
												/>
											</ImageBlockchain>
										</Tooltip>
									</Stack>
									<Stack
										direction="row"
										alignItems="end"
										justifyContent="space-between"
										spacing={1}
										sx={{ paddingTop: '10px' }}
									>
										{/* &gt; 0.001 ETH */}
										{/* {renderItemPrice(item)} */}
										<Box>
											<Typography sx={{ opacity: '0.5' }}>
												Highest bid:
											</Typography>
											<Typography variant="h4" sx={{ fontWeight: '600' }}>
												{itemPrice}{' '}
												{typeof tokenPaymentInfo === 'undefined'
													? ''
													: tokenPaymentInfo.name}
											</Typography>
										</Box>
										<Box>
											<Stack direction="row">
												<TwitterShareButton
													url={`${RELATED_URLS.MetaSpacecyHomePage}/#/detail/6273b63badcba59d78a9bc75`}
													title={`Look what I found! your collectible`}
													hashtags={['Music', 'Game']}
													via="MetaSpacecy"
												>
													<Box
														sx={{
															cursor: 'pointer',
															marginRight: '8px',
														}}
														onClick={() => {}}
													>
														{isLightTheme ? (
															<img
																src={IconTwitterBlack}
																height={18}
																width={20}
																alt="icon twitter"
															/>
														) : (
															<img
																src={IconTwitterWhite}
																height={18}
																width={20}
																alt="icon twitter"
															/>
														)}
													</Box>
												</TwitterShareButton>
												<Stack
													direction="row"
													alignItems="center"
													spacing={0.5}
												>
													<Box
														sx={{
															cursor: 'pointer',
														}}
													>
														{isLightTheme ? (
															<img
																src={IconFavoriteThinBlack}
																height={18.35}
																width={20}
																alt="icon favorite"
															/>
														) : (
															<img
																src={IconFavoriteThinWhite}
																height={18.35}
																width={20}
																alt="icon favorite"
															/>
														)}
													</Box>
													<Typography variant="body1">16</Typography>
												</Stack>
											</Stack>
											<PriceChangeStyle
												variant="caption"
												noWrap
												sx={{ opacity: '0.5' }}
											>
												1234$
											</PriceChangeStyle>
										</Box>
									</Stack>
								</Box>
								<Box>
									<ButtonWhiteBlur className="ButtonWhiteBlur">
										<style>{css}</style>
										<CountDown
											timeEnd={endTime * 1000}
											className="CountDownBar"
										/>
										<Typography className="BidPlace">Place Bid</Typography>
									</ButtonWhiteBlur>
								</Box>
							</Box>
						</ItemCardStyle>
						{itemInfo.length === 1 ? <></> : <CountItem>1/{itemInfo.length}</CountItem>}
					</PreviewItemWrapper>
				</Box>
			)}
		</Box>
	);
}
