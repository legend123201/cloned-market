/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Skeleton, Box, Stack } from '@mui/material';
// styled
import { CardWrapper, SkeletonImage, SkeletonImageWrapper } from './styled';
// vars
import { contentHeight } from 'components/CustomUI/Card/MysteryBox/BoxCard';

export interface ISkeletonBoxCardProps {}

export default function SkeletonBoxCard(props: ISkeletonBoxCardProps) {
	return (
		<CardWrapper>
			<Box sx={{ width: '100%', position: 'relative', p: 2 }}>
				<SkeletonImageWrapper>
					<SkeletonImage />
				</SkeletonImageWrapper>

				<Box sx={{ height: contentHeight, pt: 1 }}>
					<Skeleton sx={{ margin: '0 auto', width: '60%', height: '50px' }} />
					<Skeleton sx={{ mt: 0.5, height: '40px' }} />

					<Stack spacing={1.5}>
						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Skeleton sx={{ width: '30%', height: '30px' }} />
							<Skeleton sx={{ width: '30%', height: '30px' }} />
						</Stack>

						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Skeleton sx={{ width: '30%', height: '30px' }} />
							<Skeleton sx={{ width: '30%', height: '30px' }} />
						</Stack>

						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Skeleton sx={{ width: '30%', height: '30px' }} />
							<Skeleton sx={{ width: '30%', height: '30px' }} />
						</Stack>
					</Stack>

					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
						sx={{ mt: 1 }}
					>
						<Skeleton sx={{ width: '40%', height: '60px' }} />
						<Skeleton sx={{ width: '40%', height: '60px' }} />
					</Stack>
				</Box>
			</Box>
		</CardWrapper>
	);
}
