/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Skeleton, Box } from '@mui/material';
// styled
import { CardWrapper, SkeletonImage, SkeletonImageWrapper } from './styled';

export interface ISkeletonStakingItemCardProps {}

export default function SkeletonStakingItemCard(props: ISkeletonStakingItemCardProps) {
	return (
		<CardWrapper>
			<Box sx={{ width: '100%', position: 'relative' }}>
				<SkeletonImageWrapper>
					<SkeletonImage />
				</SkeletonImageWrapper>

				<Skeleton sx={{ mt: 2, height: '40px' }} />
			</Box>
		</CardWrapper>
	);
}
