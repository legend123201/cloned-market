/* eslint-disable @typescript-eslint/no-unused-vars */

import {
	Box,
	Container,
	Stack,
	Step,
	StepConnector,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import { Pagination, Navigation, Autoplay } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import { CoverHeaderImgIGO, SliderCoverItemIGO, StepperCoverIGO } from './styled';
import { SizeContext } from 'contexts/SizeObserver';
import { sliceString } from 'utils';
import ButtonGradient from 'components/CustomUI/ButtonGradient';

export interface IHeaderIGOProps {}

const steps = [
	{
		id: 1,
		title: 'Preparation',
		day: 'July 14, 2022',
		time: '10:55',
	},
	{
		id: 2,
		title: 'Subscription',
		day: 'July 15, 2022',
		time: '10:55',
	},
	{
		id: 3,
		title: 'Calculation',
		day: 'July 16, 2022',
		time: '10:55',
	},
	{
		id: 4,
		title: 'Distribution',
		day: 'July 17, 2022',
		time: '10:55',
	},
];
// maxLength: 340words
const exampTypography = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

export default function HeaderIGO(props: IHeaderIGOProps) {
	const { innerWidth } = useContext(SizeContext);
	const [stepActive, setStepActive] = useState<number>(2);

	const renderHeaderSlider = () => {
		return new Array(6).fill('a').map((item, idx) => {
			return (
				<SwiperSlide key={idx}>
					<SliderCoverItemIGO>
						<CoverHeaderImgIGO>
							<img
								src="https://i.scdn.co/image/ab67616d0000b2730e5311993a01fb2e7169f6a7"
								alt=""
							/>
						</CoverHeaderImgIGO>
						<Stack>
							<Typography variant="h3" sx={{ fontStyle: 'italic' }}>
								Lorem ipsum
							</Typography>
							{innerWidth > 1024 ? (
								<Typography mt={2}>{sliceString(exampTypography, 1500)}</Typography>
							) : (
								<Typography mt={2}>{exampTypography}</Typography>
							)}
							<StepperCoverIGO mt={4}>
								<Stepper activeStep={1} alternativeLabel>
									{steps.map((label, index) => (
										<Step key={index}>
											<StepLabel>{label.title}</StepLabel>
											{stepActive === label.id && (
												<Box>
													<Stack direction="column" alignItems="center">
														<Typography>{label.day}</Typography>
														<Typography>{label.time}</Typography>
													</Stack>
												</Box>
											)}
										</Step>
									))}
								</Stepper>
							</StepperCoverIGO>
							<Box sx={{ width: ' 180px', height: '40px', marginTop: '18px' }}>
								<ButtonGradient>View more</ButtonGradient>
							</Box>
						</Stack>
					</SliderCoverItemIGO>
				</SwiperSlide>
			);
		});
	};
	return (
		<>
			{/* <Box
				sx={{
					background: '#0B2E4B',
					borderRadius: '12px',
					border: '2px solid #0175d5',
					padding: '8px 32px',
				}}
			>
				<Stack direction="row" justifyContent="space-between">
					<Stack direction="column">
						<Typography>Total Volumne</Typography>
						<Typography>$ 99999</Typography>
					</Stack>
					<Stack direction="column">
						<Typography>Total Volumne</Typography>
						<Typography>$ 99999</Typography>
					</Stack>
					<Stack direction="column">
						<Typography>Total Volumne</Typography>
						<Typography>$ 99999</Typography>
					</Stack>
				</Stack>
			</Box> */}
			<Box mt={8}>
				<Swiper
					spaceBetween={30}
					centeredSlides={true}
					autoplay={{
						delay: 15000,
						disableOnInteraction: true,
					}}
					pagination={{
						clickable: true,
					}}
					modules={[Autoplay, Pagination]}
					className="mySwiper"
				>
					{renderHeaderSlider()}
				</Swiper>
			</Box>
		</>
	);
}
