import React from 'react';
import SkeletonNftActivityCard from '../../Item/SkeletonNftActivityCard';

type SkeletonListProps = {
	amount?: number;
};

export default function SkeletonNftActivityList({ amount }: SkeletonListProps) {
	return (
		<>
			{new Array(amount ? amount : 5).fill(null).map((item, idx) => {
				return <SkeletonNftActivityCard key={idx} />;
			})}
		</>
	);
}
