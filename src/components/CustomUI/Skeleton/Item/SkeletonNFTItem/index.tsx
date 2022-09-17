/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Skeleton, Box } from '@mui/material';
// styled
import { CardWrapper, SkeletonContent, SkeletonImage } from './styled';

import { contentHeight } from 'components/CustomUI/Card/NFTItemCard';

export interface ISkeletonNFTItemCardProps {}

export default function SkeletonNFTItemCard(props: ISkeletonNFTItemCardProps) {
	return (
		<CardWrapper>
			<Box sx={{ p: 1.5 }}>
				<SkeletonImage width="100%" variant="rectangular" />

				<SkeletonContent sx={{ height: contentHeight, pt: 1 }}>
					<Skeleton sx={{ mt: 1, height: '40px' }} />
					<Skeleton sx={{ mt: 0.5, height: '40px' }} />
				</SkeletonContent>
			</Box>
		</CardWrapper>
	);
}
