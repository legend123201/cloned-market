/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
// mui
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
// styled
import { TabListStyled, TabStyled, TypographyStyled } from './styled';

export interface TabProps {
	tabItems: any;
	tabSections: any;
}
const TabAuction = ({ tabItems, tabSections }: TabProps) => {
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
				sx={{ display: 'flex' }}
			>
				{tabItems
					.filter((item: any) => item.isShow)
					.map((item: any, idx: number) => (
						<TabStyled
							className="son"
							key={idx}
							sx={{ maxWidth: 'none' }}
							label={
								<TypographyStyled variant="body1" sx={{ ml: 1 }} noWrap>
									{item.title}
								</TypographyStyled>
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
};

export default TabAuction;
