import { styled, Box, Card } from '@mui/material';

export const ItemCardStyle = styled(Card)(({ theme }) => ({
	cursor: 'pointer',
	padding: 10,
	// transition: 'all .3s cubic-bezier(0,0,.5,1)',
	WebkitTransition: '0.2s all ease-out',
	MozTransition: '0.2s all ease-out',
	OTransition: '0.2s all ease-out',
	transition: '0.2s all ease-out',

	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
		  }
		: {
				border: '2px solid',
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

export const MediaErrorContent = styled(Box)({
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: 10,
	textAlign: 'center',
});

export const MainImage = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: '100%',
	paddingTop: '50%',
	margin: '0 auto',
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

export const ButtonCustom = styled(Box)(({ theme }) => ({
	width: '100%',
	cursor: 'pointer',
	background: theme.palette.primary.main,
	borderRadius: theme.shape.borderRadius,
	padding: '10px 0',
	textAlign: 'center',
	marginTop: 10,

	'& .not-hovering': {
		display: 'block',
	},

	'& .hovering': {
		display: 'none',
	},

	'&:hover': {
		background: theme.palette.gradients.main,

		'& .not-hovering': {
			display: 'none',
		},

		'& .hovering': {
			display: 'block',
		},
	},
}));

export const ComponentIndex = styled(Box)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '100px',
	height: '100px',
	borderRadius: theme.shape.borderRadiusLg,

	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.main,
		  }
		: {
				background: theme.palette.primary.main,
		  }),

	'&.active': {
		background: theme.palette.gradients.main,
	},
}));
