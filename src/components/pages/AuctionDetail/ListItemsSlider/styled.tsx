import { Box, styled } from '@mui/material';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const SwiperWrapperAuctionDetail = styled(Box)(({ theme }) => ({
	position: 'relative',
	img: {
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
	'.swiper': {
		position: 'static',
	},

	'.mySwiper': {
		'.swiper-button-prev, .swiper-button-next': {
			position: 'absolute',
			top: '50%',
			width: 35,
			height: 35,
			borderRadius: '50%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',

			...(theme.palette.mode === 'light'
				? {
						backgroundColor: theme.palette.primaryLight.dark,
				  }
				: {
						backgroundColor: theme.palette.primary.main,
				  }),

			'&::after': {
				fontSize: '15px',
				color: theme.palette.text.primary,
				opacity: 0.5,
				fontWeight: 600,
			},

			'&:hover': {
				...(theme.palette.mode === 'light'
					? {
							backgroundColor: theme.palette.primaryLight.darker,
					  }
					: {
							backgroundColor: theme.palette.primary.light,
					  }),
			},
		},
		'.swiper-button-prev': {
			left: -15,
		},
		'.swiper-button-next': {
			right: -15,
		},

		'.swiper-slide': {
			// '&.swiper-slide-active': {
			// 	'.slide-item': {
			// 		background: 'blue',
			// 		transform: 'scale(1)',
			// 	},
			// },
		},
	},
}));

export const SwiperSlideItemAuctionDetail = styled(Box)(({ theme }) => ({
	padding: 10,
	transition: 'all 0.6s ease',
	textAlign: 'center',
	borderRadius: '12px',
	...(theme.palette.mode === 'dark'
		? {
				backgroundColor: theme.palette.primary.dark,
		  }
		: {
				backgroundColor: theme.palette.primaryLight.dark,
		  }),
	'&:hover': {
		...(theme.palette.mode === 'dark'
			? {
					backgroundColor: theme.palette.primary.main,
			  }
			: {
					backgroundColor: theme.palette.primaryLight.darker,
			  }),
	},
}));

export const ItemCover = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: '100%',
	paddingTop: '100%',
	borderRadius: '10px',
	overflow: 'hidden',

	img: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},
}));

export const ItemCoverMedia = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxHeight: '100%',
	maxWidth: '100%',
	video: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},
}));
