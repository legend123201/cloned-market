/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
// mui
import { Box, Skeleton, Stack, useTheme } from '@mui/material';
// styled
import { SkeletonCollectionCardContainer } from './styled';

import { backgroundHeight, contentPartHeight } from 'components/CustomUI/Card/CollectionCard';

export interface ISkeletonCollectionCardProps {}

export default function SkeletonCollectionCard(props: ISkeletonCollectionCardProps) {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';

	return (
		<SkeletonCollectionCardContainer alignItems="center" direction="column" width="100%">
			<Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', width: '100%' }}>
				<Skeleton
					variant="rectangular"
					sx={{
						margin: '0 !important',
						padding: '0 !important',
						height: 286,
						width: '100%',
						borderRadius: '12px',
					}}
				/>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						minWidth: '90px',
						maxWidth: '92px',
						gap: '8px',
					}}
				>
					<Skeleton
						variant="rectangular"
						sx={{
							margin: '0 !important',
							padding: '0 !important',
							height: '90px',
							width: '100%',
							borderRadius: '12px',
						}}
					/>
					<Skeleton
						variant="rectangular"
						sx={{
							margin: '0 !important',
							padding: '0 !important',
							height: '90px',
							width: '100%',
							borderRadius: '12px',
						}}
					/>
					<Skeleton
						variant="rectangular"
						sx={{
							margin: '0 !important',
							padding: '0 !important',
							height: '90px',
							width: '100%',
							borderRadius: '12px',
						}}
					/>
				</Box>
			</Box>

			<Stack sx={{ width: '100%', paddingTop: '12px' }}>
				<Skeleton height={40} width="60%" />
				<Stack direction="row" justifyContent="space-between" width="100%" gap={6}>
					<Skeleton height={40} width="50%" />
					<Skeleton height={40} width="50%" />
				</Stack>
			</Stack>
		</SkeletonCollectionCardContainer>
	);
}
