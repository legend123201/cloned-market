import React, { useEffect } from 'react';
// redux

// components

import { Box, Tab, Tabs } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { TypographyStyled } from './styled';
import { PATH_AUCTION } from 'routes/path';

export interface IAuctionProps {}
function TabAuctionAll() {
	const [value, setValue] = React.useState(0);
	const { pathname } = useLocation();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	useEffect(() => {
		const checkRoute = (pathname: any): void => {
			switch (pathname) {
				case `${PATH_AUCTION.liveOn}`: {
					setValue(0);
					break;
				}
				case `${PATH_AUCTION.upComming}`: {
					setValue(1);
					break;
				}
				case `${PATH_AUCTION.completed}`: {
					setValue(2);
					break;
				}
				case `${PATH_AUCTION.attendance}`: {
					setValue(3);
					break;
				}
				default: {
					setValue(0);
				}
			}
		};
		checkRoute(pathname);
		return;
		// eslint-disable-next-line
	}, [pathname]);
	return (
		<>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab
						href={`#${PATH_AUCTION.liveOn}`}
						label={
							<TypographyStyled sx={{ ml: 1 }} noWrap>
								Live On
							</TypographyStyled>
						}
					/>
					<Tab
						href={`#${PATH_AUCTION.upComming}`}
						label={
							<TypographyStyled sx={{ ml: 1 }} noWrap>
								Up Comming
							</TypographyStyled>
						}
					/>
					<Tab
						href={`#${PATH_AUCTION.completed}`}
						label={
							<TypographyStyled sx={{ ml: 1 }} noWrap>
								Completed
							</TypographyStyled>
						}
					/>
					<Tab
						href={`#${PATH_AUCTION.attendance}`}
						label={
							<TypographyStyled sx={{ ml: 1 }} noWrap>
								Attendance
							</TypographyStyled>
						}
					/>
				</Tabs>
			</Box>
		</>
	);
}
export default React.memo(TabAuctionAll);
