import React from 'react';
import SkeletonActivityCard from '../../Item/SkeletonActivityCard';

type SkeletonListProps = {
	amount?: number;
};

export default function SkeletonActivityList({ amount }: SkeletonListProps) {
	return (
		<>
			{new Array(amount ? amount : 5).fill(null).map((item, idx) => {
				return <SkeletonActivityCard key={idx} />;
			})}
		</>
	);
}
