import React from 'react';
import { Grid } from '@mui/material';
import SkeletonStakingItemCard from '../../../Item/Mysterybox/SkeletonStakingItemCard';

type SkeletonStakingItemCardListProps = {
	amount?: number;
};

export default function SkeletonStakingItemCardList({
	amount = 8,
}: SkeletonStakingItemCardListProps) {
	return (
		<>
			{new Array(amount).fill(null).map((item, idx) => {
				return (
					<Grid item xs={1} key={idx}>
						<SkeletonStakingItemCard key={idx} />
					</Grid>
				);
			})}
		</>
	);
}
