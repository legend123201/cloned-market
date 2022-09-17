/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// components
import InfoAccountUser from 'components/pages/InfoAccount/InfoAccountUser';
import TabInfoAccount from 'components/pages/InfoAccount/TabInfoAccount';
import { IFormEditProfileInputs } from 'components/Form/FormEditProfile';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
// mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
// slices
import { selectUser } from 'redux/slices/userSlice';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
import {
	selectFilter as selectFilterListOffer,
	setFilter,
	resetAll,
} from 'redux/slices/orderSlice';
// actions
import { updateUser } from 'redux/actions/userAction';
import { fetchListPaymentTokenByChainId } from 'redux/actions/tokenPaymentAction';
import { fetchListOrderOffer } from 'redux/actions/orderAction';
// styled
import { UserBackground } from './styled';
// model
import { OptionSelectCustom, Response, User } from 'models';
// enum
import { FilterOfferOption } from 'enum';
import uploadApi from 'apis/uploadApi';

const filterOptions: OptionSelectCustom<string>[] = [
	{
		name: 'Offer received',
		value: String(FilterOfferOption.OfferReceived),
	},
	{
		name: 'Offer made',
		value: String(FilterOfferOption.OfferMade),
	},
];

function MyInfoAccount() {
	const dispatch = useDispatch();

	// useState
	const [currentFilterOfferOption, setCurrentFilterFilterOfferOption] = useState<
		OptionSelectCustom<string>
	>(filterOptions[0]);
	const [isOpenModalEditProfile, setIsOpenModalEditProfile] = useState<boolean>(false);

	// useSelector
	const userInfo: User | null = useSelector(selectUser);
	const chainId = useSelector(selectChainId);
	const userAddress = useSelector(selectAddress);
	const filterListOffer = useSelector(selectFilterListOffer);

	// useEffect
	// fetch list token payment
	useEffect(() => {
		if (chainId) {
			dispatch(fetchListPaymentTokenByChainId(chainId, executeAfterFetchListTokenPayment));
		}
	}, [chainId]);

	// fetch list order offer
	useEffect(() => {
		if (userAddress && chainId && Object.keys(filterListOffer).length > 0) {
			dispatch(
				fetchListOrderOffer(
					{ ...filterListOffer, asc: '-1', chainId },
					executeAfterFetchListOrderOffer
				)
			);
		}

		return () => {
			dispatch(resetAll());
		};
	}, [dispatch, userAddress, chainId, filterListOffer]);

	// setFilter list order offer
	useEffect(() => {
		if (userAddress) {
			if (Number(currentFilterOfferOption.value) === FilterOfferOption.OfferReceived) {
				dispatch(setFilter({ taker: userAddress }));
			} else {
				dispatch(setFilter({ maker: userAddress }));
			}
		}
	}, [userAddress, currentFilterOfferOption]);

	// functions
	const executeAfterFetchListTokenPayment = (globalStateNewest: RootState) => {
		const { tokenPayment } = globalStateNewest;
		if (!tokenPayment.isSuccess) {
			toast.error('Can not fetch list token payment!');
		}
	};

	const executeAfterFetchListOrderOffer = (globalStateNewest: RootState) => {
		const { order } = globalStateNewest;
		if (!order.isSuccess) {
			toast.error('Can not fetch list offer!' + order.errorMessage);
		}
	};

	const onSubmitEditProfile = async (data: IFormEditProfileInputs) => {
		if (!userAddress) return;

		const avatar: any = data.avatar;
		const background: any = data.background;
		let avatarURL: string = '';
		let backgroundURL: string = '';

		try {
			if (typeof avatar === 'string') {
				// if this is string, it's because it is already an image url
				avatarURL = avatar;
			} else {
				const avatarForm = new FormData();
				avatarForm.append('file', avatar.raw);
				const res: Response<any> = await uploadApi.uploadUserMedia(avatarForm, userAddress);
				avatarURL = res.data;
			}

			if (typeof background === 'string') {
				// if this is string, it's because it is already an image url
				backgroundURL = background;
			} else {
				const backgroundForm = new FormData();
				backgroundForm.append('file', background.raw);
				const res: Response<any> = await uploadApi.uploadUserMedia(
					backgroundForm,
					userAddress
				);
				backgroundURL = res.data;
			}

			const executeAfterUpdateUser = (globalStateNewest: RootState) => {
				const { user } = globalStateNewest;

				if (user.isSuccess) {
					toast.success('Update profile success!');
					setIsOpenModalEditProfile(false);
				} else {
					toast.error(user.errorMessage);
				}
			};

			const newData: User = {
				...data,
				avatar: avatarURL,
				background: backgroundURL,
				userAddress,
			};
			// console.log(newData);

			dispatch(updateUser(newData, executeAfterUpdateUser));
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	return (
		<Container maxWidth="xxl" sx={{ pt: '5px', mt: 16 }}>
			{userAddress && userInfo && (
				<Fragment>
					<UserBackground>
						<LazyImageCustom
							src={userInfo.background}
							alt="user background"
							wrapperPosition="relative"
							type="skeleton"
							imgStyle={{ objectFit: 'cover', width: '100%', height: '100%' }}
						/>
					</UserBackground>

					<InfoAccountUser
						infoUser={userInfo}
						modal={isOpenModalEditProfile}
						setModal={setIsOpenModalEditProfile}
						onSubmitEditProfile={onSubmitEditProfile}
					/>
				</Fragment>
			)}
			<TabInfoAccount
				// props for OffersTab
				currentFilterOfferOption={currentFilterOfferOption}
				setCurrentFilterFilterOfferOption={setCurrentFilterFilterOfferOption}
				listFilterOfferOption={filterOptions}
			/>
		</Container>
	);
}

export default MyInfoAccount;
