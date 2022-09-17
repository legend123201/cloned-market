import React from 'react';
import { Grid } from '@mui/material';
import SkeletonAssetBoxCard from '../../../Item/Mysterybox/SkeletonAssetBoxCard';

type SkeletonAssetBoxListProps = {
	amount?: number;
};

export default function SkeletonAssetBoxList({ amount = 8 }: SkeletonAssetBoxListProps) {
	return (
		<>
			{new Array(amount).fill(null).map((item, idx) => {
				return (
					<Grid item xs={1} key={idx}>
						<SkeletonAssetBoxCard key={idx} />
					</Grid>
				);
			})}
		</>
	);
}
