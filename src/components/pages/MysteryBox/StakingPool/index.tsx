/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
// mui
import { Box, Grid, Link, Stack, Typography, useTheme } from '@mui/material';
// styled
import { BoxCoverStakingPools, OpacityTypography } from './styled';
// images
import IconView from 'assets/icons/external-link-gradient.webp';
// components
import ButtonGradient from 'components/CustomUI/ButtonGradient';
// path
import { PATH_EARN } from 'routes/path';
// constants
import { RELATED_URLS, ETHERSCAN, CONTRACT } from '../../../../constants';
// redux
import { selectChainId } from 'redux/slices/web3InfoSlice';
import { useSelector } from 'react-redux';

export interface IStakingPoolProps {
	detailStakingPool: any;
}

export default function StakingPool({ detailStakingPool }: IStakingPoolProps) {
	const navigate = useNavigate();
	const theme = useTheme();

	// useSelector
	const chainId = useSelector(selectChainId);

	// functions
	const getEtherscanInfoByChainId = (id: number) => {
		return ETHERSCAN[id];
	};

	return (
		<Box sx={{ mt: 5 }}>
			<Stack direction="row" justifyContent="space-between">
				<Stack direction="row" gap={1} alignItems="center">
					<Typography variant="h4" fontStyle="italic">
						Total Practicipants:
					</Typography>
					<Typography variant="h4" fontStyle="italic">
						{detailStakingPool?.totalParticipants} stacker(s)
					</Typography>
				</Stack>
				<Box>
					<ButtonGradient
						sx={{ width: '120px', height: '40px' }}
						onClick={() => navigate(`${PATH_EARN.userDetail}`)}
					>
						<Typography>User info</Typography>
					</ButtonGradient>
				</Box>
			</Stack>

			<Box mt={2}>
				<Grid container spacing={5}>
					{detailStakingPool?.totalSlots.map((item: any, index: number) => (
						<Grid item xs={12} sm={4} key={index}>
							<BoxCoverStakingPools>
								<OpacityTypography variant="subtitle2">
									MetaSpacecy
								</OpacityTypography>
								<Typography variant="h4">{item.itemName}</Typography>

								<Stack spacing={0.5}>
									<Stack mt={2} direction="row" justifyContent="space-between">
										<OpacityTypography variant="subtitle2">
											MST earn
										</OpacityTypography>
										<Typography variant="subtitle2">{item.totalNST}</Typography>
									</Stack>
									<Stack direction="row" justifyContent="space-between">
										<OpacityTypography variant="subtitle2">
											Total stake
										</OpacityTypography>
										<Typography variant="subtitle2">
											{item.totalStake}
										</Typography>
									</Stack>
									<Stack direction="row" justifyContent="space-between">
										<OpacityTypography variant="subtitle2">
											Ticket cards
										</OpacityTypography>
										<Typography variant="subtitle2">
											{item.totalTicketCard}
										</Typography>
									</Stack>
								</Stack>
							</BoxCoverStakingPools>
						</Grid>
					))}
				</Grid>

				<Stack
					direction="row"
					sx={{ mt: 2, marginLeft: 'auto', width: 'fit-content' }}
					spacing={2}
					flexWrap="wrap"
					justifyContent="end"
				>
					<Stack direction="row" gap={1}>
						<img style={{ maxHeight: '1.5rem' }} src={IconView} alt="" />
						<Link
							href={`${getEtherscanInfoByChainId(chainId).url}address/${
								CONTRACT[chainId].MetaSpacecyStaking
							}`}
							target="_blank"
							sx={{
								cursor: 'pointer',
								color: theme.palette.text.special,
								'&:hover': {
									textDecoration: 'underline !important',
								},
							}}
						>
							View contract
						</Link>
					</Stack>
					<Stack direction="row" gap={1}>
						<img style={{ maxHeight: '1.5rem' }} src={IconView} alt="" />
						<Link
							href={RELATED_URLS.tutorialStakeItem}
							target="_blank"
							sx={{
								cursor: 'pointer',
								color: theme.palette.text.special,
								'&:hover': {
									textDecoration: 'underline !important',
								},
							}}
						>
							View tutorial
						</Link>
					</Stack>
				</Stack>
			</Box>
		</Box>
	);
}
