/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Skeleton, Box, Stack, useTheme } from '@mui/material';
import { Wrapper } from './styled';

export interface ISkeletonActivityCardProps {}

export default function SkeletonActivityCard(props: ISkeletonActivityCardProps) {
	const theme = useTheme();

	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-between"
			sx={{
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '8px 12px',
				margin: '4px 0',
				borderRadius: '12px',
				gap: '12px',
				...(theme.palette.mode === 'light'
					? { background: theme.palette.primaryLight.main }
					: {
							background: theme.palette.primary.dark,
					  }),
			}}
		>
			<Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
				<Skeleton
					variant="rectangular"
					width={60}
					height={60}
					sx={{ borderRadius: '12px' }}
				/>

				<Box sx={{ ml: 2, flexGrow: 1 }}>
					<Skeleton variant="text" sx={{ maxWidth: '220px' }} />
					<Skeleton variant="text" sx={{ maxWidth: '180px' }} />
				</Box>
			</Stack>

			<Skeleton variant="rectangular" sx={{ width: '22px' }} />
		</Stack>
	);
}
