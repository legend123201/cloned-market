/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
//components
import ItemInfoTab from '../Tabs/ItemInfoTab';
import DescriptionTab from '../Tabs/DescriptionTab';
import ListingTab from '../Tabs/ListingTab';
import OfferTab from '../Tabs/OfferTab';
import GraphTab from '../Tabs/GraphTab';
import TabCommon from 'components/CustomUI/Tab/TabCommon';
// images
import iconAssetWhite from 'assets/icons/asset-white.webp';
import iconDescriptionWhite from 'assets/icons/description-white.webp';
import iconOfferWhite from 'assets/icons/offer-white.webp';
import iconGraphWhite from 'assets/icons/graph-white.webp';

import iconAssetBlack from 'assets/icons/asset-black.webp';
import iconDescriptionBlack from 'assets/icons/description-black.webp';
import iconOfferBlack from 'assets/icons/offer-black.webp';
import iconGraphBlack from 'assets/icons/graph-black.webp';

import iconAssetBlue from 'assets/icons/asset-blue.webp';
import iconDescriptionBlue from 'assets/icons/description-blue.webp';
import iconOfferBlue from 'assets/icons/offer-blue.webp';
import iconGraphBlue from 'assets/icons/graph-blue.webp';
// models
import { NFT, PriceActivity, OrderResponseAPI } from 'models';
// mui
import { useTheme } from '@mui/material';
import DetailTab from '../Tabs/DetailTab';
import ActivityTab from '../Tabs/ActivityTab';

export interface ITabItemDetailProps {
	// props for ItemInfoTab
	// item: NFT | null;
	// personalOffer: OrderResponseAPI | null;
	// personalOrderSell: OrderResponseAPI | null;
	// loadingPersonalOffer: boolean;
	// loadingPersonalOrderSell: boolean;
	// refetchApi: VoidFunction;
	// props for GraphTab
	listActivityPriceChart: PriceActivity[];
}

function TabItemDetail({
	// props for ItemInfoTab
	// item,
	// personalOffer,
	// personalOrderSell,
	// loadingPersonalOffer,
	// loadingPersonalOrderSell,
	// refetchApi,
	// props for GraphTab
	listActivityPriceChart,
}: ITabItemDetailProps) {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';

	const tabsDetail = {
		items: [
			{
				title: 'Detail',
				icon: isLightTheme ? (
					<img src={iconAssetBlack} alt="asset icon" width={20} height={20} />
				) : (
					<img src={iconAssetWhite} alt="asset icon" width={20} height={20} />
				),
				iconSelected: <img src={iconAssetBlue} alt="asset icon" width={20} height={20} />,
				isShow: true,
			},
			{
				title: 'Activity',
				icon: isLightTheme ? (
					<img src={iconDescriptionBlack} alt="description icon" width={20} height={16} />
				) : (
					<img src={iconDescriptionWhite} alt="description icon" width={20} height={16} />
				),
				iconSelected: (
					<img src={iconDescriptionBlue} alt="description icon" width={20} height={16} />
				),
				isShow: true,
			},
			{
				title: 'Graph',
				icon: isLightTheme ? (
					<img src={iconGraphBlack} alt="graph icon" width={32} height={15} />
				) : (
					<img src={iconGraphWhite} alt="graph icon" width={32} height={15} />
				),
				iconSelected: <img src={iconGraphBlue} alt="graph icon" width={32} height={15} />,
				isShow: true,
			},
		],
		sections: [
			{ Section: <DetailTab />, isShow: true },
			{
				Section: <ActivityTab />,
				isShow: true,
			},
			{
				Section: <GraphTab listActivityPriceChart={listActivityPriceChart} />,
				isShow: true,
			},
		],
	};
	return (
		<TabCommon
			tabItems={tabsDetail.items}
			tabSections={tabsDetail.sections}
			tabAlignment="left"
		/>
	);
}

export default React.memo(TabItemDetail);
