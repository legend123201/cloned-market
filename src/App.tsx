/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
// styled
import './App.styled.ts';
import { PageBackground, RootPage, RootPageWrapper } from 'App.styled';
// routes
import Router from './routes';
// lib
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
// date/time lib
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// components
import ModalComingSoon from 'components/CustomUI/CommingSoonModal';
import { BaseOptionChartStyle } from 'components/pages/ItemDetail/Tabs/GraphTab/BaseOptionChart';
// context
import SizeObserver from 'contexts/SizeObserver';
import ScrollObserver from 'contexts/ScrollObserver';
import AudioProvider from 'contexts/AudioContext';
import SocketProvider from 'contexts/SocketContext';

function App() {
	const [renderComingSoon, setRenderComingSoon] = useState<boolean>(false);

	// useEffect
	useEffect(() => {
		setInterval(() => {
			setRenderComingSoon(true);
		}, 5000);
	}, []);

	const getLibrary = (provider: any): Web3Provider => {
		const library = new Web3Provider(provider);
		library.pollingInterval = 12000;
		return library;
	};

	return (
		<ScrollObserver>
			<SizeObserver>
				<SocketProvider>
					<AudioProvider>
						<LocalizationProvider dateAdapter={DateAdapter}>
							<RootPageWrapper>
								<RootPage>
									<HashRouter basename="/">
										<Web3ReactProvider getLibrary={getLibrary}>
											<PageBackground />
											<BaseOptionChartStyle />
											<Router />
										</Web3ReactProvider>
										{/* {renderComingSoon && <ModalComingSoon />} */}
									</HashRouter>
								</RootPage>
							</RootPageWrapper>
						</LocalizationProvider>
					</AudioProvider>
				</SocketProvider>
			</SizeObserver>
		</ScrollObserver>
	);
}

export default App;
