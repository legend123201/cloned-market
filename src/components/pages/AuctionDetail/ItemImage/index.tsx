/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuctionDetail } from 'redux/slices/auctionDetailByAuctionIdSlice';
import { BoxImage, BoxTrick, MediaWrapperAuction } from './styled';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import { Pagination, Navigation } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import { SwiperSlideItemAuctionDetail } from './styled';
import { Typography } from '@mui/material';
import ReactPlayer from 'react-player/lazy';
import { compressImage, getFileType } from 'utils';
// IMG

export interface ItemImageProps {}
export default function ItemImage() {
	const auctionDetail = useSelector(selectAuctionDetail);
	// const swiper = document.querySelector('.mySwiper');
	const [indexSlide, setIndexSlide] = useState<number>();
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	// console.log('swiper index', swiper);
	const renderImg = () => {
		return auctionDetail?.items.map((item: any, index: number) => {
			return (
				<SwiperSlide key={index}>
					<SwiperSlideItemAuctionDetail>
						{getFileType(item.itemMedia) === 'mp4' ? (
							<MediaWrapperAuction>
								<ReactPlayer
									url={item.itemMedia}
									className="react-player"
									muted={true}
									playing={true}
									loop={true}
									controls={true}
									volume={0.5}
									config={{
										file: {
											attributes: {
												controlsList: 'nodownload',
											},
										},
									}}
								/>
							</MediaWrapperAuction>
						) : (
							<img
								src={item.itemMedia}
								alt="none"
								style={{
									borderRadius: '12px',
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									maxHeight: '100%',
									maxWidth: '100%',
									opacity: 1,
								}}
							/>
						)}
					</SwiperSlideItemAuctionDetail>
				</SwiperSlide>
			);
		});
	};
	return (
		<Fragment>
			<BoxTrick>
				<BoxImage>
					<Swiper
						slidesPerView={1}
						spaceBetween={30}
						slidesPerGroup={1}
						loop={true}
						loopFillGroupWithBlank={true}
						// navigation={true}
						modules={[Pagination, Navigation]}
						className="mySwiper"
						initialSlide={0}
						// tabIndex={}
						onSlideChange={(e: any) => {
							setIndexSlide(e.realIndex + 1);
						}}
					>
						{renderImg()}
					</Swiper>
				</BoxImage>
			</BoxTrick>

			<Typography sx={{ opacity: 0.8, fontSize: '14px', textAlign: 'center' }}>
				{indexSlide ? indexSlide : auctionDetail?.listItemId.length}/
				{auctionDetail?.listItemId.length}
			</Typography>
		</Fragment>
	);
}
