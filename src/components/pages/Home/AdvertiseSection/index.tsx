/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { toast } from 'react-toastify';
// mui
import { Box, Skeleton } from '@mui/material';
// swiper
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import { Autoplay, Pagination } from 'swiper';
// api
import advertiseApi from 'apis/advertiseApi';
// model
import { ListResponseNonPaging } from 'models';
// utils
import { compressImage } from 'utils';
// components
import LoadingPage from 'components/CustomUI/LoadingPage';
// redux
import { selectLoadingPage, setLoading } from 'redux/slices/loadingSlice';
import { useDispatch, useSelector } from 'react-redux';
// context
import { SizeContext } from 'contexts/SizeObserver';
// styled
import { AdvertiseSectionWrapper, SliderItem } from './styled';

const AdvertiseSection: React.FC = () => {
	const [listVideo, setListVideo] = useState<any>([]);
	// const [isLoading, setIsLoading] = useState<boolean>(false);

	const dispatch = useDispatch();
	const isLoadingPage = useSelector(selectLoadingPage);

	const { innerWidth } = useContext(SizeContext);

	useEffect(() => {
		(async () => {
			try {
				dispatch(setLoading(true));

				const res: ListResponseNonPaging<string> = await advertiseApi.getListVideo();
				setListVideo(res.data);
				setTimeout(() => dispatch(setLoading(false)), 1000);
			} catch (error: any) {
				dispatch(setLoading(false));
				toast.error(error.message);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Check width device

	const [playPause, setPlayPause] = useState(true);
	useEffect(() => {
		if (innerWidth > 500) {
			setPlayPause(true);
		} else {
			setPlayPause(false);
		}
	}, [innerWidth]);
	// console.log('listVideo', listVideo);

	// Test
	const getFrameFromVideo = () => {};
	const renderListSlider = (listVideo: string[]) => {
		return listVideo.map((video: string, index: number) => (
			<SwiperSlide key={index}>
				<Box sx={{ position: 'relative', pt: '100%' }}>
					<SliderItem>
						<ReactPlayer
							className="video-slider"
							url={compressImage(video, 967, 'best')}
							muted={true}
							playing={playPause}
							playsinline={true}
							loop={true}
							width="100%"
							height="100%"
						/>
					</SliderItem>
				</Box>
			</SwiperSlide>
		));
	};

	return (
		<AdvertiseSectionWrapper>
			{isLoadingPage ? (
				// <Box sx={{ position: 'relative', pt: '100%', width: '100%' }}>
				// 	<Skeleton
				// 		sx={{
				// 			position: 'absolute',
				// 			top: 0,
				// 			left: 0,
				// 			width: '100%',
				// 			height: '100%',
				// 			WebkitTransform: 'scale(1,1)',
				// 			transform: 'scale(1,1)',
				// 		}}
				// 	/>
				// </Box>
				<LoadingPage />
			) : (
				<Swiper
					pagination={true}
					modules={[Pagination, Autoplay]}
					className="mySwiper"
					autoplay={{ delay: 5000, disableOnInteraction: false }}
				>
					{renderListSlider(listVideo)}
				</Swiper>
			)}
		</AdvertiseSectionWrapper>
	);
};

export default React.memo(AdvertiseSection);
