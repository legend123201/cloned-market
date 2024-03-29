/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
// mui
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
// styled
import { TabListStyled, TabStyled } from './styled';
import { Stack, Typography } from '@mui/material';

export interface ITabMysteryBoxProps {
	tabItems: any;
	tabSections: any;
}

export default function TabMysteryBox({ tabItems, tabSections }: ITabMysteryBoxProps) {
	const [value, setValue] = React.useState('0');

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<TabContext value={value}>
			<TabListStyled
				className="father"
				variant="scrollable"
				allowScrollButtonsMobile
				onChange={handleChange}
				aria-label="lab API tabs"
			>
				{tabItems
					.filter((item: any) => item.isShow)
					.map((item: any, idx: number) => (
						<TabStyled
							className="son"
							key={idx}
							sx={{ maxWidth: 'none' }}
							label={
								// <Stack direction="row" alignItems="center">
								// 	{item.icon && item.iconSelected && (
								// 		<Box sx={{ mr: 1 }}>
								// 			<Box className="unselected">{item.icon}</Box>
								// 			<Box className="selected">{item.iconSelected}</Box>
								// 		</Box>
								// 	)}

								<Typography variant="h4" noWrap>
									{item.title}
								</Typography>
								// </Stack>
							}
							value={idx.toString()}
						/>
					))}
			</TabListStyled>

			<Box sx={{ marginTop: 3 }}>
				{tabSections
					.filter((item: any) => item.isShow)
					.map((item: any, idx: number) => (
						<TabPanel key={idx} value={idx.toString()}>
							{item.Section}
						</TabPanel>
					))}
			</Box>
		</TabContext>
	);
}
