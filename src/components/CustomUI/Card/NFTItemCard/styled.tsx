import { styled, Card, Typography, Box } from '@mui/material';

export const ItemCardStyle = styled(Card)(({ theme }) => ({
	// transition: 'all .3s cubic-bezier(0,0,.5,1)',
	// display: 'none',
	WebkitTransition: '0.2s all ease-out',
	MozTransition: '0.2s all ease-out',
	OTransition: '0.2s all ease-out',
	transition: '0.2s all ease-out',

	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
		  }
		: {
				// border: '2px solid',
				// borderColor: theme.palette.primary.main,
				background: theme.palette.gradients.fourth,
		  }),

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					boxShadow: theme.customShadows.cardLightHover,
					transform: 'scale(1.01)',
			  }
			: {
					background: theme.palette.gradients.third,
					// transition: 'background 2s ease',
			  }),
	},
}));

export const ItemImage = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: '100%',
	paddingTop: '100%',
	borderRadius: '10px',
	// overflow: 'hidden',
	cursor: 'pointer',

	'.main-img img, video': {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},
}));

export const ItemFavorite = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '0',
	right: '8px',
	display: 'flex',
	flexDirection: 'row',
	gap: '4px',
	alignItems: 'center',
	height: '30px',
	borderRadius: '8px',
	padding: '8px',
	cursor: 'default',

	...(theme.palette.mode === 'light'
		? { backgroundColor: theme.palette.primaryLight.main }
		: {
				backgroundColor: theme.palette.primary.main,
		  }),
}));

export const IconFavorite = styled('img')(({ theme }) => ({
	height: 14,
	width: 'auto',
}));

export const ItemContent = styled(Box)(({ theme }) => ({}));

export const PriceStyle = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.special,
}));

export const PriceChangeStyle = styled(Typography)(({ theme }) => ({
	fontStyle: 'italic',
}));

export const ImageBlockchain = styled(Box)(({ theme }) => ({
	width: 20,
	height: 20,
	borderRadius: '50%',
	overflow: 'hidden',

	img: {
		width: '100%',
		height: '100%',
	},
}));

export const ContentFooter = styled(Box)(({ theme }) => ({
	borderRadius: theme.shape.borderRadiusSm,
	overflow: 'hidden',
	position: 'relative',

	'&::before': {
		content: '""',
		position: 'absolute',
		height: '100%',
		width: '100%',
		opacity: 0.2,
		zIndex: -1,

		...(theme.palette.mode === 'light'
			? {
					backgroundColor: theme.palette.primaryLight.darker,
			  }
			: {
					backgroundColor: theme.palette.primary.light,
			  }),
	},
}));

export const BoxCountDown = styled(Box)(({ theme }) => ({
	position: 'absolute',
	height: '2.5rem',
	width: '60%',
	zIndex: '2',
	top: '-10px',
	left: '0',
	borderRadius: theme.shape.borderRadiusMd,
	padding: '0.5rem',
	border: '1px solid #ffffff',
	backgroundImage:
		'linear-gradient(52deg,rgb(0, 255, 54) 7%,rgb(0, 238, 87) 17%,rgb(0, 197, 173) 37%,rgb(0, 164, 241) 52%,rgb(11, 24, 252) 88%,rgb(13, 0, 255) 94%)',
}));

export const AvatarIcon = styled(Box)(({ theme }) => ({
	transition: 'all 0.6s ease',
	cursor: 'pointer',
	':hover': {
		zIndex: 3,
		transform: 'translateY(-5px)',
	},
}));

export const GradIcon = styled(Box)({
	borderRadius: '50%',
	width: 25,
	height: 25,
});

export const ErrorContent = styled(Box)({
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: 10,
	textAlign: 'center',
});

export const StackCard = styled(Box)(({ theme }) => ({
	// transition: 'all .3s cubic-bezier(0,0,.5,1)',
	position: 'absolute',
	top: '-2px',
	width: '100%',
	height: '100%',
	borderRadius: '18px',

	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
		  }
		: {
				borderTop: '2px solid',
				// borderLeft: '2px solid',
				// borderRight: '2px solid',
				borderColor: theme.palette.primary.main,
				background: theme.palette.gradients.fourth,
		  }),

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					boxShadow: theme.customShadows.cardLightHover,
					transform: 'scale(1.01)',
			  }
			: {
					background: theme.palette.gradients.third,
					// transition: 'background 2s ease',
			  }),
	},
}));

export const DropDownWrapper = styled(Box)(({ theme }) => ({
	borderRadius: theme.shape.borderRadiusSm,
	minWidth: 120,
	padding: '8px 8px',

	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.dark,
		  }
		: {
				backgroundImage: theme.palette.gradients.modal,
		  }),
}));

export const DropDownOption = styled(Typography)(({ theme }) => ({
	display: 'block',
	borderRadius: theme.shape.borderRadiusSm,
	padding: '4px 8px',
	color: theme.palette.text.primary,
	cursor: 'pointer',
	transition: 'all 0.2s',
	whiteSpace: 'nowrap',
	fontWeight: '700',
	textAlign: 'left',

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					background: theme.palette.primaryLight.light,
			  }
			: {
					background: theme.palette.primary.main,
			  }),
	},
}));

export const LinkWrapper = styled('a')(({ theme }) => ({
	...(theme.palette.mode === 'light'
		? {
				color: 'black',
		  }
		: {
				color: 'white',
		  }),
}));
