import React from 'react';
import { Grid } from '@mui/material';
import SkeletonBoxCard from '../../../Item/Mysterybox/SkeletonBoxCard';

type SkeletonBoxListProps = {
	amount?: number;
};

export default function SkeletonBoxList({ amount = 4 }: SkeletonBoxListProps) {
	return (
		<>
			<Grid container spacing={6}>
				{new Array(amount).fill(null).map((item, idx) => {
					return (
						<Grid item xs={3} key={idx}>
							<SkeletonBoxCard key={idx} />
						</Grid>
					);
				})}
			</Grid>
		</>
	);
}
