import { styled, Box, Typography, Stack, Link } from '@mui/material';

export const breakpointsCollectionInfoStack = 1250;

export const InfoCollectionWrapper = styled(Box)(({ theme }) => ({
	position: 'relative',
	transform: 'translateY(-30%)',
	borderRadius: 25,
	padding: '20px 0px 20px 40px',
	margin: '0 100px',
	boxShadow: '0px 0px 5px rgba(20, 86, 163)',

	[theme.breakpoints.down(breakpointsCollectionInfoStack)]: {
		boxShadow: 'unset',
		margin: 'unset',
		padding: 'unset',
		top: -70,
		transform: 'unset',
		backgroundColor: 'unset',
		textAlign: 'center',
	},

	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.main,
		  }
		: {
				background: 'rgba(2, 28, 56, 0.7)',
		  }),
}));

export const MoreOptions = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 20,
	right: 20,
	...(theme.palette.mode === 'light'
		? {
				borderColor: '#000',
		  }
		: {
				borderColor: '#fff',
		  }),

	[theme.breakpoints.down(breakpointsCollectionInfoStack)]: {
		top: 80,
		right: 10,
		border: '1px solid',
		borderRadius: 10,
		padding: '5px 10px',
	},

	[theme.breakpoints.down('sm')]: {
		border: 'unset',
		padding: 0,
	},
}));

export const InfoStack = styled(Stack)(({ theme }) => ({
	[theme.breakpoints.up(breakpointsCollectionInfoStack)]: {
		flexDirection: 'row',
	},
}));

export const AvatarWrapper = styled(Box)(({ theme }) => ({
	borderRadius: '50%',
	[theme.breakpoints.down(breakpointsCollectionInfoStack)]: {
		boxShadow: `0px 0px 5px ${theme.palette.grey['500']}`,
	},
}));

export const CollectionInfo = styled(Stack)(({ theme }) => ({
	marginLeft: '20px',

	[theme.breakpoints.down(breakpointsCollectionInfoStack)]: {
		marginLeft: 0,
		alignItems: 'center',
	},
}));

export const CollectionName = styled(Typography)(({ theme }) => ({
	fontWeight: 600,
}));

export const InfoAddressList = styled(Box)(({ theme }) => ({
	[theme.breakpoints.down(breakpointsCollectionInfoStack)]: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
}));

export const InfoAddressItem = styled(Box)(({ theme }) => ({
	display: 'flex',
	marginTop: 2,
}));

export const InfoAddress = styled(Typography)(({ theme }) => ({
	marginRight: 5,

	[theme.breakpoints.down(500)]: {
		fontSize: 14,
	},
}));

// new
export const CollectionDescription = styled(Box)(({ theme }) => ({}));

export const ReadMoreButton = styled(Typography)(({ theme }) => ({
	cursor: 'pointer',
	color: theme.palette.text.special,
}));

export const StyledSpanSecondary = styled('span')(({ theme }) => ({
	color: theme.palette.text.secondary,
}));

export const StyledSpanSpecial = styled('span')(({ theme }) => ({
	color: theme.palette.text.special,
}));

export const DropDownWrapper = styled(Box)(({ theme }) => ({
	borderRadius: theme.shape.borderRadiusSm,
	minWidth: 160,
	padding: '8px 4px',

	...(theme.palette.mode === 'light'
		? {
				background: theme.palette.primaryLight.dark,
		  }
		: {
				backgroundImage: theme.palette.gradients.modal,
		  }),
}));

export const DropDownOption = styled(Link)(({ theme }) => ({
	display: 'block',
	borderRadius: theme.shape.borderRadiusSm,
	padding: '8px 20px',
	color: theme.palette.text.primary,
	cursor: 'pointer',
	transition: 'all 0.2s',
	whiteSpace: 'nowrap',
	fontWeight: 'bold',

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

export const FeatureWrapper = styled(Box)(({ theme }) => ({
	border: '1px solid',
	borderColor: 'grey',
	display: 'flex',
	justifyContent: 'center',
	borderRadius: theme.shape.borderRadiusSm,
}));
