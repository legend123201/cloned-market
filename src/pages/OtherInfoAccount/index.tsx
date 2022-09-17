/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
//components
import InfoAccountUser from 'components/pages/InfoAccount/InfoAccountUser';
import TabInfoAccount from 'components/pages/InfoAccount/TabInfoAccount';
import LazyImage from 'components/CustomUI/LazyImages/LazyImage';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
// mui
import { Container } from '@mui/material';
//redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
// slices
import { selectOtherUserInfo } from 'redux/slices/userSlice';
import { selectChainId } from 'redux/slices/web3InfoSlice';
//actions
import { getOtherUserInfo } from 'redux/actions/userAction';
import { fetchListPaymentTokenByChainId } from 'redux/actions/tokenPaymentAction';
// styled
import { UserBackground } from './styled';
// model
import { OptionSelectCustom, User } from 'models';
// enum
import { FilterOfferOption } from 'enum';

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

function OtherInfoAccount() {
	const dispatch = useDispatch();
	const { infoAccountAddress } = useParams();

	// useSelector
	const otherUserInfo: User | null = useSelector(selectOtherUserInfo);
	const chainId = useSelector(selectChainId);

	// useEffect
	// get info of infoAccountAddress
	useEffect(() => {
		if (infoAccountAddress) {
			dispatch(getOtherUserInfo(infoAccountAddress, executeAfterGetOtherUser));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [infoAccountAddress]);

	// fetch list token payment
	useEffect(() => {
		if (chainId) {
			dispatch(fetchListPaymentTokenByChainId(chainId, executeAfterFetchListTokenPayment));
		}
	}, [chainId]);

	// function
	const executeAfterGetOtherUser = (globalStateNewest: RootState) => {
		const { user } = globalStateNewest;
		if (!user.isSuccess) {
			toast.error('Some error occur when getting other user info! ' + user.errorMessage);
		}
	};

	const executeAfterFetchListTokenPayment = (globalStateNewest: RootState) => {
		const { tokenPayment } = globalStateNewest;
		if (!tokenPayment.isSuccess) {
			toast.error('Can not fetch list token payment!');
		}
	};

	return (
		<>
			<Container maxWidth="xxl" sx={{ pt: '5px', mt: 16 }}>
				<UserBackground>
					{otherUserInfo && (
						<LazyImageCustom
							src={otherUserInfo.background}
							alt="user background"
							wrapperPosition="relative"
							type="skeleton"
							imgStyle={{ objectFit: 'cover', width: '100%', height: '100%' }}
						/>
					)}
				</UserBackground>

				<InfoAccountUser
					infoUser={otherUserInfo}
					modal={false}
					setModal={() => {}}
					onSubmitEditProfile={() => {}}
				/>

				<TabInfoAccount
					// props for OffersTab
					currentFilterOfferOption={{ name: '', value: '' }}
					setCurrentFilterFilterOfferOption={() => {}}
					listFilterOfferOption={filterOptions}
				/>
			</Container>
		</>
	);
}

export default OtherInfoAccount;
