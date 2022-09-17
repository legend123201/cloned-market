import React from 'react';
import { Box, Skeleton, Stack, useTheme } from '@mui/material';
import { SkeletonUserCardContainer } from './styled';
import { backgroundHeight, contentPartHeight } from 'components/CustomUI/Card/UserCard';

export interface ISkeletonUserCardProps {}

export default function SkeletonUserCard(props: ISkeletonUserCardProps) {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';

	return (
		<SkeletonUserCardContainer alignItems="center" direction="column">
			<Box sx={{ position: 'relative', width: '100%' }}>
				<Skeleton
					variant="rectangular"
					sx={{
						margin: '0 !important',
						padding: '0 !important',
						height: backgroundHeight,
						width: '100%',
					}}
				/>

				<Skeleton
					variant="circular"
					width={100}
					height={100}
					sx={{
						position: 'absolute',
						top: '100%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						boxShadow: `0px 0px 10px 20px ${theme.palette.grey['600']}`,
						bgcolor: isLightTheme ? 'grey.100' : '#1A3049',
					}}
				/>
			</Box>

			<Stack
				alignItems="center"
				sx={{ width: '100%', height: contentPartHeight, paddingTop: '60px' }}
			>
				<Skeleton height={40} width="60%" />
				<Skeleton width="50%" />
				<Skeleton width="40%" sx={{ mt: 2, mb: 2 }} />
			</Stack>
		</SkeletonUserCardContainer>
	);
}
