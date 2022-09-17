/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
// styled
import { FooterHome, SocialMedia, StyledLink } from './styled';
// mui
import { Stack, Typography, useTheme } from '@mui/material';
// images
import ImageTwitter from 'assets/images/footer/twitter.webp';
import ImageTele from 'assets/images/footer/tele.webp';
import ImageGithub from 'assets/images/footer/github.webp';
import ImageMedium from 'assets/images/footer/medium.webp';
import ImageDiscord from 'assets/images/footer/discord.webp';
import ImageStar from 'assets/images/footer/star.webp';
import ImageTag from 'assets/images/footer/tag.webp';
import LogoSpaceX from 'assets/images/home/logoSpaceX.webp';
// constants
import { RELATED_URLS } from '../../../constants';

const Footer: React.FC = () => {
	const theme = useTheme();

	return (
		<FooterHome>
			<Stack
				spacing={2}
				justifyContent={{ xs: 'unset', md: 'space-between' }}
				alignItems={{ xs: 'center', md: 'unset' }}
				direction={{ xs: 'column', md: 'row' }}
				sx={{
					pb: 2,
					mb: 2,
					borderBottom: '2px solid',
					borderColor: theme.palette.border.cardDark,
				}}
			>
				<SocialMedia>
					<Stack direction="row" spacing={3}>
						<a href={RELATED_URLS.twitter} target="_blank" rel="noreferrer">
							<img src={ImageTwitter} alt="twitter icon" />
						</a>
						<a href={RELATED_URLS.telegram} target="_blank" rel="noreferrer">
							<img src={ImageTele} alt="telegram icon" />
						</a>
						<a href={RELATED_URLS.github} target="_blank" rel="noreferrer">
							<img src={ImageGithub} alt="github icon" />
						</a>
						<a href={RELATED_URLS.medium} target="_blank" rel="noreferrer">
							<img src={ImageMedium} alt="medium icon" />
						</a>
						<a href={RELATED_URLS.discord} target="_blank" rel="noreferrer">
							<img src={ImageDiscord} alt="discord icon" />
						</a>
					</Stack>
				</SocialMedia>

				<Stack
					direction="row"
					justifyContent="center"
					flexWrap="wrap"
					sx={{
						gap: '24px',

						[theme.breakpoints.down('sm')]: {
							gap: '14px',
						},
					}}
				>
					<Stack direction="row" alignItems="center" spacing={1}>
						<img
							src={ImageTag}
							alt="tag icon"
							style={{ width: 'auto', height: '20px' }}
						/>
						<StyledLink href={RELATED_URLS.privacyPolicy} target="_blank">
							Privacy Policy
						</StyledLink>
					</Stack>

					<Stack direction="row" alignItems="center" spacing={1}>
						<img
							src={ImageTag}
							alt="tag icon"
							style={{ width: 'auto', height: '20px' }}
						/>
						<StyledLink href={RELATED_URLS.termsOfService} target="_blank">
							Terms of service
						</StyledLink>
					</Stack>

					<Stack direction="row" alignItems="center" spacing={1}>
						<img
							src={ImageStar}
							alt="star icon"
							style={{ width: 'auto', height: '20px' }}
						/>
						<StyledLink href={RELATED_URLS.forbitswapHomePage} target="_blank">
							forbitswap
						</StyledLink>
					</Stack>
				</Stack>
			</Stack>

			<Stack justifyContent="center" alignItems="center">
				<Stack direction="row" alignItems="center" spacing={1}>
					<img
						src={LogoSpaceX}
						alt="loading space"
						width="30"
						height="30"
						style={{ marginRight: '7px' }}
					/>

					<Typography variant="body1">forbitspace foundation LLC</Typography>
				</Stack>
				<Typography variant="body1">© 2021 @forbitspace, All Rights Reserved</Typography>
			</Stack>
		</FooterHome>
	);
};
export default React.memo(Footer);
