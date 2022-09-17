import React, { useEffect } from 'react';
// mui
import { Box, Container, Typography } from '@mui/material';
// components

// import DividerGradient from 'components/CustomUI/DividerGradient';
// import EarnAssets from 'components/pages/EarnAssets';
import BoxesTab from 'components/pages/MysteryBox/Tabs/BoxesTab';
import AssetsTab from 'components/pages/MysteryBox/Tabs/AssetsTab';
import StakingTab from 'components/pages/MysteryBox/Tabs/StakingTab';
import UserAssetsLessInfo from 'components/pages/EarnAssets/UserAssetsLessInfo';

export interface IMysteryboxProps {}

export default function Mysterybox(props: IMysteryboxProps) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<Container maxWidth="xxl" sx={{ mt: 16 }}>
			<Typography variant="h2" sx={{ mt: 3, textAlign: 'center', fontStyle: 'italic' }}>
				MetaSpacecy Assets
			</Typography>
			{/* <Typography variant="h3" sx={{ mt: 3, textAlign: 'center' }}>
				Getting more passive incomes and privileges in the ecosystem.
			</Typography>

			<DividerGradient sx={{ mt: 2, height: '3px' }} /> */}
			<Box>
				<UserAssetsLessInfo />
			</Box>
			<Box sx={{ mt: 8, position: 'relative' }}>
				<Box
					id="MMB"
					sx={{
						position: 'absolute',
						top: '-20%',
					}}
				></Box>
				<Typography variant="h3">MetaSpacecy Mysterious Boxes</Typography>
				{/* <TabEarnAssets /> */}
				{/* <EarnAssets />/ */}
				<BoxesTab />
			</Box>
			<Box sx={{ mt: 8, position: 'relative' }}>
				<Box
					id="MCA"
					sx={{
						position: 'absolute',
						top: '-20%',
					}}
				></Box>
				<Typography variant="h3">MetaSpacecy Creature Accessory</Typography>
				{/* <TabEarnAssets /> */}
				{/* <EarnAssets />/ */}
				<AssetsTab />
			</Box>
			<Box sx={{ mt: 8 }} id="staking">
				<Typography variant="h3" textAlign="center">
					MetaSpacecy Staking
				</Typography>

				<StakingTab />
			</Box>
		</Container>
	);
}
