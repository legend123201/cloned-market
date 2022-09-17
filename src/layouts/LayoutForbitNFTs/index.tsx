/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { Outlet } from 'react-router-dom';
// lib
import detectEthereumProvider from '@metamask/detect-provider';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
// styled
import { MainStyle, RootStyle } from './styled';
// mui
import { Container, Typography, useTheme, Box } from '@mui/material';
// components
import Modal from 'components/CustomUI/Modal';
import Header from 'components/Layouts/Header';
import Footer from 'components/Layouts/Footer';
import LoadingPage from 'components/CustomUI/LoadingPage';
// redux
import { useDispatch, useSelector } from 'react-redux';
import {
	selectAddress,
	selectChainId,
	setChainId,
	setUserLogin,
	setCurrentProvider,
} from 'redux/slices/web3InfoSlice';
import { selectLoadingPage } from 'redux/slices/loadingSlice';
// utils
import { isSupportChainId, hexToDecimal } from 'utils';
import ButtonGradient from 'components/CustomUI/ButtonGradient';

import { loginUser } from 'redux/actions/userAction';
import { SocketContext } from 'contexts/SocketContext';
import FooterComp from 'components/Layouts/FooterComp';

declare let window: any;

function LayoutForbitNFTs() {
	const theme = useTheme();
	const ethereum: any = window.ethereum;
	const dispatch = useDispatch();
	const web3 = new Web3(Web3.givenProvider);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);
	const isLoading = useSelector(selectLoadingPage);

	//state
	let [modalError, setModalError] = useState(false);

	//socket
	const { socketAuth } = useContext(SocketContext);

	// useEffect
	// get current provider
	useEffect(() => {
		const loadWeb3 = async () => {
			const provider = await detectEthereumProvider({ timeout: 1000 });
			if (provider === window.ethereum) {
				if (window.ethereum && window.ethereum.isMetaMask) {
					dispatch(setCurrentProvider(new Web3(window.ethereum)));
				} else if (window.web3) {
					dispatch(setCurrentProvider(new Web3(window.web3.currentProvider)));
				}
			} else {
				dispatch(setChainId(4));
			}
		};
		loadWeb3();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// connect socket
	useEffect(() => {
		if (userAddress) {
			dispatch(loginUser(userAddress)); // not need call back because "login and sign back"

			// socketAuth.connect();
			// socketAuth.emit('login', `${userAddress} connect`);
		}

		return () => {
			socketAuth.off('login');
			socketAuth.removeAllListeners();
			socketAuth.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAddress]);

	useEffect(() => {
		(async () => {
			if (ethereum) {
				// get userAddress and chainId
				const userAddressArr: string[] = await web3.eth.getAccounts();

				const userAddress = userAddressArr[0];
				const chainId: number = await web3.eth.getChainId();

				checkSupportedNetWork(chainId);
				dispatch(setUserLogin(userAddress?.toLowerCase()));

				// functions on change userAddress and chainId
				ethereum.on('chainChanged', (chainId: string) => {
					// Handle the new chain.
					// Correctly handling chain changes can be complicated.
					// We recommend reloading the page unless you have good reason not to.
					checkSupportedNetWork(hexToDecimal(chainId));
				});

				ethereum.on('accountsChanged', (accounts: string[]) => {
					// Handle the new accounts, or lack thereof.
					// "accounts" will always be an array, but it can be empty.
					dispatch(setUserLogin(accounts[0]?.toLowerCase()));
				});
			} else {
				dispatch(setChainId(undefined));
				dispatch(setUserLogin(undefined));
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, ethereum]);

	// functions
	const checkSupportedNetWork = (chainId: number | undefined) => {
		if (chainId) {
			if (isSupportChainId(chainId)) {
				setModalError(false);
				dispatch(setChainId(chainId));
			} else {
				setModalError(true);
				dispatch(setChainId(undefined));
			}
		} else {
			dispatch(setChainId(4));
		}
	};

	const changeNetwork = async (chainId: number) => {
		if (typeof window.ethereum !== 'undefined') {
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: Web3.utils.toHex(chainId) }],
				});

				toast.success('Switch network successfully');
			} catch (error: any) {
				toast.error('Switch network failed!');
			}
		}
	};

	return (
		<RootStyle>
			<Header />
			{isLoading && <LoadingPage />}
			<Box>
				<MainStyle
					sx={{
						transition: theme.transitions.create('margin', {
							duration: theme.transitions.duration.complex,
						}),
					}}
				>
					<Outlet />
				</MainStyle>
			</Box>

			{modalError && (
				<Modal
					onOpen={modalError}
					mainHeader="Wrong network"
					allowClose={false}
					style={{ width: 500 }}
				>
					<Typography sx={{ textAlign: 'center', p: '2rem', pt: '1rem' }}>
						Wrong network! Currently, we only support BNB testnet and Rinkeby testnet,
						please switch to the right one.
					</Typography>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItem: 'center',
							justifyContent: 'space-between',
							pb: '1.5rem',
							px: '2rem',
						}}
					>
						<Box sx={{ width: '40%' }}>
							<ButtonGradient
								onClick={() => {
									changeNetwork(4);
								}}
							>
								Switch to Rinkeby
							</ButtonGradient>
						</Box>

						<Box sx={{ width: '40%' }}>
							<ButtonGradient
								onClick={() => {
									changeNetwork(97);
								}}
							>
								Switch to BNB
							</ButtonGradient>
						</Box>
					</Box>
				</Modal>
			)}

			<FooterComp />
		</RootStyle>
	);
}

export default LayoutForbitNFTs;
