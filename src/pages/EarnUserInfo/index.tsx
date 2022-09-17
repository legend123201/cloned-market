import React from 'react';
// mui
import { Box, Container, Typography } from '@mui/material';
// components

import UserInfoStaking from 'components/pages/MysteryBox/Tabs/UserInfoStaking';

export interface IEarnStakingProps {}

export default function EarnUserInfo(props: IEarnStakingProps) {
	return (
		<Container maxWidth="xxl" sx={{ mt: 16 }}>
			<Typography variant="h2" sx={{ mt: 3, textAlign: 'center', fontStyle: 'italic' }}>
				MetaSpacecy User
			</Typography>
			<Box sx={{ mt: 2 }}>
				<UserInfoStaking />
			</Box>
		</Container>
	);
}
