import { Grid } from '@mui/material';
import React from 'react';
import SkeletonUserCard from '../../Item/SkeletonUserCard';

export default function SkeletonUserList() {
	return (
		<>
			{new Array(6).fill(null).map((item, idx) => {
				return (
					<Grid item xs={1} key={idx}>
						<SkeletonUserCard />
					</Grid>
				);
			})}
		</>
	);
}
