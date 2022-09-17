import { styled, Box, Avatar, Stack, Typography } from '@mui/material';

export const CollectionCardWrapper = styled(Box)(({ theme }) => ({
	borderRadius: 12,
	overflow: 'hidden',
	cursor: 'pointer',
	transition: 'all 0.5s ease',
	zIndex: '100',
	img: {
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
				background: theme.palette.primaryLight.lighter,
		  }
		: {
				background: theme.palette.gradients.fourth,
				boxShadow: `0 7px 12px rgba(0, 0, 0, 0.1), 0 4px 4px rgba(0, 0, 0, 0.1)`,
		  }),

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					boxShadow: theme.customShadows.cardLightHover,
			  }
			: {
					background: theme.palette.gradients.third,
					boxShadow: theme.customShadows.cardDarkHover,
			  }),
	},
}));

export const ContentPart = styled(Box)(({ theme }) => ({
	paddingTop: 60,
	zIndex: 4,
	position: 'relative',
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: '#fff',
		  }
		: {}),
}));

export const CollectionBackground = styled(Box)(({ theme }) => ({
	position: 'relative',
}));

export const CollectionLogoWrapper = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '100%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
}));

export const CollectionLogo = styled(Avatar)(({ theme }) => ({
	border: '4px solid #75aaff',
	boxShadow: '0 0 10px grey',
	backgroundColor: theme.palette.primary.main,
}));

export const CollectionInfo = styled(Stack)(({ theme }) => ({
	padding: '0 15px 15px 15px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
}));

export const CollectionName = styled(Typography)(({ theme }) => ({
	textAlign: 'center',
}));

export const ImageBlockchain = styled(Box)(({ theme }) => ({
	width: 24,
	height: 24,
	borderRadius: '50%',
	overflow: 'hidden',

	img: {
		width: '100%',
		height: '100%',
	},
}));

export const CollectionWrapperNew = styled(Box)(({ theme }) => ({
	position: 'relative',
	padding: '16px',
	zIndex: '2',
	cursor: 'pointer',
	borderRadius: '12px',
	transition: 'all ease 0.5s',
	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.lighter,
				boxShadow: theme.customShadows.cardLight,
				'&:hover': {
					boxShadow: theme.customShadows.cardLightHover,
				},
		  }
		: {
				border: '1px solid',
				borderColor: theme.palette.primary.main,
				background: theme.palette.gradients.fourth,
				boxShadow: `0 7px 12px rgba(0, 0, 0, 0.2), 0 4px 4px rgba(0, 0, 0, 0.2)`,
				'&:hover': {
					background: theme.palette.gradients.third,
					boxShadow: theme.customShadows.cardDarkHover,
				},
		  }),
}));

export const ItemImage = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: '100%',
	paddingTop: '100%',
	borderRadius: '10px',
	overflow: 'hidden',
	cursor: 'pointer',

	'img, video': {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxHeight: '100%',
		maxWidth: '100%',
	},
}));
