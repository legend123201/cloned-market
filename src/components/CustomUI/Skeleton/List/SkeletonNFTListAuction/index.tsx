import React from 'react';
import SkeletonNFTItemCardAuction from '../../Item/SkeletonNFTCardAuction';

type SkeletonListProps = {
	amount?: number;
};

export default function SkeletonNftListAuction({ amount }: SkeletonListProps) {
	return (
		<>
			{new Array(amount ? amount : 4).fill(null).map((item, idx) => {
				return <SkeletonNFTItemCardAuction key={idx} />;
			})}
		</>
	);
}
