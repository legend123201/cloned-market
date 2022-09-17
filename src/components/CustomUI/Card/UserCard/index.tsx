/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, lazy, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// mui
import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
// styled
import {
	BottomPart,
	CollectionBackground,
	CollectionCardWrapper,
	CollectionInfo,
	CollectionLogo,
	CollectionLogoWrapper,
	CollectionName,
	CollectionNumberItem,
	CollectionOwner,
	OwnerName,
} from './styled';
// models
import { Response, User } from 'models';
// utils
import { compressImage, sliceAddress } from 'utils';
// components
import SkeletonUserCard from 'components/CustomUI/Skeleton/Item/SkeletonUserCard';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
// apis
import userApi from 'apis/userApi';
// redux
import { useSelector } from 'react-redux';
import { selectAddress } from 'redux/slices/web3InfoSlice';
// path
import { PATH_PAGE } from 'routes/path';
// hooks
import { useIsMounted } from 'hooks';

export const backgroundHeight: number = 150;
export const contentPartHeight: number = 170;

export interface IUserCardProps {
	currentUserAddress: string;
}

export default function UserCard({ currentUserAddress }: IUserCardProps) {
	const navigate = useNavigate();
	const theme = useTheme();

	// hooks
	const isMounted = useIsMounted();

	// useState
	const [user, setUser] = useState<User>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [refetchApi, setRefetchApi] = useState<boolean>(false);

	// useSelector
	const userAddress = useSelector(selectAddress);

	// useEffect
	useEffect((): any => {
		if (!currentUserAddress) return;

		(async () => {
			setIsLoading(true);

			try {
				const res: Response<User> = await userApi.getUserByAddress(currentUserAddress);

				if (isMounted()) {
					setUser(res.data);
					setIsSuccess(true);
				}
			} catch (error) {
				setIsLoading(false);
				setIsSuccess(false);
				console.log(error);
			} finally {
				if (isMounted()) {
					setIsLoading(false);
				}
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUserAddress, refetchApi]);

	// functions
	const ErrorMediaRender = () => {
		return (
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					background: 'grey',
					opacity: '0.2',
				}}
			></Box>
		);
	};

	return (
		<Box>
			{!isLoading ? (
				!isSuccess ? (
					<Box sx={{ position: 'relative' }}>
						<Box
							className="fake-height"
							sx={{ height: `${backgroundHeight + contentPartHeight}px` }}
						></Box>

						<Stack
							justifyContent="center"
							alignItems="center"
							sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
							}}
						>
							<Box
								sx={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									zIndex: '0',
									backgroundColor: 'gray',
									opacity: '0.2',
									borderRadius: '15px',
								}}
							></Box>
							<Typography variant="h6">Error</Typography>
							<Typography variant="body2" sx={{ px: 5, pb: 1, textAlign: 'center' }}>
								Something went wrong when load this user. Please refresh.
							</Typography>

							<IconButton
								aria-label="refresh"
								onClick={(e) => {
									e.stopPropagation();
									setRefetchApi(!refetchApi);
								}}
							>
								<RefreshIcon />
							</IconButton>
						</Stack>
					</Box>
				) : user ? (
					<Fragment>
						<CollectionCardWrapper
							onClick={() => {
								if (user.userAddress === userAddress) {
									navigate(`${PATH_PAGE.user}`);
								} else {
									navigate(`${PATH_PAGE.otherUser}/${user.userAddress}`);
								}
							}}
						>
							<CollectionBackground sx={{ height: backgroundHeight }}>
								<LazyImageCustom
									src={
										user.background
											? compressImage(user.background, 500, 'best')
											: '/baner3.png'
									}
									alt="user background"
									type="skeleton"
									wrapperPosition="relative"
									errorComponent={ErrorMediaRender()}
								/>

								<CollectionLogoWrapper>
									<CollectionLogo
										sx={{ width: '100px', height: '100px' }}
										src={user.avatar && compressImage(user.avatar, 150, 'best')}
										alt={user.username}
									/>
								</CollectionLogoWrapper>
							</CollectionBackground>

							<BottomPart sx={{ height: contentPartHeight }}>
								<CollectionInfo>
									<CollectionName variant="h5">{user.username}</CollectionName>

									<CollectionOwner>
										<Typography variant="subtitle1">Address: </Typography>

										<OwnerName variant="subtitle1">
											{sliceAddress(user.userAddress, 6, 5)}
										</OwnerName>
									</CollectionOwner>

									<CollectionNumberItem variant="subtitle2" noWrap>
										Total items: {user.totalItems}
									</CollectionNumberItem>
								</CollectionInfo>
							</BottomPart>
						</CollectionCardWrapper>
					</Fragment>
				) : (
					<></>
				)
			) : (
				<SkeletonUserCard />
			)}
		</Box>
	);
}
