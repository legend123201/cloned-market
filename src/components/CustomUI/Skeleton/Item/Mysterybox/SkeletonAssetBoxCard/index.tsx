/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Skeleton, Box } from '@mui/material';
// styled
import { CardWrapper, SkeletonImage, SkeletonImageWrapper } from './styled';

export interface ISkeletonAssetBoxCardProps {}

export default function SkeletonAssetBoxCard(props: ISkeletonAssetBoxCardProps) {
	return (
		<CardWrapper>
			<Box sx={{ width: '100%', position: 'relative' }}>
				<SkeletonImageWrapper>
					<SkeletonImage />
				</SkeletonImageWrapper>

				<Skeleton sx={{ mt: 1, height: '22px' }} />
			</Box>
		</CardWrapper>
	);
}
