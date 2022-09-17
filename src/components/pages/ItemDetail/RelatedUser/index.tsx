/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
// mui
import { Avatar, Box, Stack, Typography } from '@mui/material';
// images
import VerifiedIcon from 'assets/icons/blue-verify.svg';
// styled
import { TitleInfo, UserName } from './styled';
// models
import { User } from 'models';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// path
import { PATH_PAGE } from 'routes/path';

export interface IRelatedUserProps {
	user: User;
	position: 'Creator' | 'Owner';
}

// "https://deothemes.com/envato/xhibiter/html/img/products/item_single_large.jpg"

export default function RelatedUser({ user, position }: IRelatedUserProps) {
	const navigate = useNavigate();

	// useSelector
	const userAddress = useSelector(selectAddress);

	return (
		<Box>
			<Stack direction="row" alignItems="center" spacing={2}>
				{/* User image */}
				<Box sx={{ position: 'relative' }}>
					<Avatar
						src={user.avatar}
						alt="user avatar"
						variant="rounded"
						sx={{ width: '48px', height: '48px' }}
					/>

					<Box
						sx={{
							width: '20px',
							position: 'absolute',
							bottom: '-5px',
							right: '-5px',
						}}
					>
						<img
							src={VerifiedIcon}
							alt="icon verified"
							style={{ width: '100%', height: 'auto' }}
						/>
					</Box>
				</Box>

				{/* User info */}
				<Box>
					<TitleInfo variant="subtitle2">{position}</TitleInfo>
					<UserName
						variant="subtitle2"
						onClick={() =>
							userAddress === user.userAddress
								? navigate(`${PATH_PAGE.user}`)
								: navigate(`${PATH_PAGE.otherUser}/${user.userAddress}`)
						}
					>
						{user.username}
					</UserName>
				</Box>
			</Stack>
		</Box>
	);
}
