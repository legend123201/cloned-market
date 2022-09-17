/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
// components
import TabMysteryBox from 'components/CustomUI/Tab/TabMysteryBox';
import AssetsTab from '../Tabs/AssetsTab';
import BoxCollectionsTab from '../Tabs/BoxCollectionsTab';
import BoxesTab from '../Tabs/BoxesTab';
import StakingTab from '../Tabs/StakingTab';

export interface ITabMysteryBoxProps {}

function TabEarnAssets(props: ITabMysteryBoxProps) {
	const tabsDetail = {
		items: [
			{
				title: 'Boxes',
				icon: null,
				iconSelected: null,
				isShow: true,
			},
			{
				title: 'Assets',
				icon: null,
				iconSelected: null,
				isShow: true,
			},
		],
		sections: [
			{
				Section: <BoxesTab />,
				isShow: true,
			},
			{
				Section: <AssetsTab />,
				isShow: true,
			},
		],
	};

	return <TabMysteryBox tabItems={tabsDetail.items} tabSections={tabsDetail.sections} />;
}

export default React.memo(TabEarnAssets);
