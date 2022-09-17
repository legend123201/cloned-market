import { Box } from '@mui/material';
import React from 'react';
import AttendanceTab from './Attendance';
import CompletedTab from './Completed';
import LiveOnTab from './LiveOn';
import UpcomingTab from './UpComing';

export interface IAuctionComponentNewProps {}

export default function AuctionComponentNew(props: IAuctionComponentNewProps) {
	return (
		<>
			<Box mt={6}>
				<LiveOnTab />
			</Box>
			<Box mt={6}>
				<UpcomingTab />
			</Box>
			<Box mt={6}>
				<CompletedTab />
			</Box>
			<Box mt={6}>
				<AttendanceTab />
			</Box>
		</>
	);
}
