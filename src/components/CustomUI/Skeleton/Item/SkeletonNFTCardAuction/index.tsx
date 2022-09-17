/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Skeleton, Box, Stack } from '@mui/material';
// styled
import { CardWrapper, SkeletonContent, SkeletonImage } from './styled';

export interface ISkeletonNFTItemCardProps {}

export default function SkeletonNFTItemCardAuction(props: ISkeletonNFTItemCardProps) {
	return (
		<CardWrapper>
			<Box sx={{}}>
				<SkeletonImage width="100%" variant="rectangular" />

				<SkeletonContent sx={{ p: 1.5 }}>
					<Skeleton
						variant="text"
						sx={{ my: 0, height: '40px', width: '50%', mr: 'auto', ml: 'auto' }}
					/>
					<Skeleton variant="text" sx={{ mt: 0.5, height: '60px' }} />
					<Stack mt={0.5} direction="row" justifyContent="space-between">
						<Skeleton sx={{ height: '36px', width: '120px' }} />
						<Skeleton sx={{ height: '36px', width: '120px' }} />
					</Stack>
					<Stack mt={0.5} direction="row" justifyContent="space-between">
						<Skeleton sx={{ height: '36px', width: '120px' }} />
						<Skeleton sx={{ height: '36px', width: '120px' }} />
					</Stack>
					<Stack mt={0.5} direction="row" justifyContent="space-between">
						<Skeleton sx={{ height: '36px', width: '120px' }} />
						<Skeleton sx={{ height: '36px', width: '120px' }} />
					</Stack>
				</SkeletonContent>
			</Box>
		</CardWrapper>
	);
}
