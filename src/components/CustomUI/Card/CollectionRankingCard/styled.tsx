import { styled, Stack, Typography, Avatar } from '@mui/material';

export const CollectionItem = styled(Stack)(({ theme }) => ({
	cursor: 'pointer',
	borderRadius: '8px',
	padding: 10,
	transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
	position: 'relative',

	'&:hover': {
		...(theme.palette.mode === 'light'
			? {
					boxShadow: theme.customShadows.cardLightHover,
			  }
			: {
					boxShadow: theme.customShadows.cardDarkHover,
			  }),
	},

	...(theme.palette.mode === 'light'
		? {
				boxShadow: theme.customShadows.cardLight,
				background: theme.palette.primaryLight.lighter,
		  }
		: {
				// backgroundColor: theme.palette.primary.dark,
				backgroundImage: theme.palette.gradients.third,
		  }),
}));

export const CollectionRank = styled(Typography)(({ theme }) => ({
	width: 20,
	fontWeight: 'bold',
	opacity: 0.5,
	marginRight: 4,
	marginLeft: 4,
}));

export const CollectionAvatar = styled(Avatar)(({ theme }) => ({
	width: 50,
	height: 50,
	backgroundColor: 'black',
}));

export const CollectionInfo = styled(Stack)(({ theme }) => ({
	marginLeft: 10,
	minWidth: 0,
}));

export const NameInfo = styled(Typography)(({ theme }) => ({
	fontWeight: 400,
}));

export const TotalInfo = styled(Typography)(({ theme }) => ({
	opacity: 0.5,
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
