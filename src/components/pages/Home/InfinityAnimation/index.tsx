import React from 'react';
import { useTheme } from '@mui/material';
import { AstronautContainer, AstronautImg, AstronautTxt, InfinityImg } from './styled';
// images
import TextInfinityWhite from 'assets/images/home/text-infinity-white.webp';
import TextInfinityBlack from 'assets/images/home/text-infinity-black.webp';
import Astronaut from 'assets/images/home/astronaut.webp';
import Infinity from 'assets/images/home/infinity.webp';

const InfinityAnimation = () => {
	// vars
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';

	return (
		<AstronautContainer>
			<AstronautImg>
				<img loading="lazy" src={Astronaut} alt="astronaut" />
			</AstronautImg>
			<InfinityImg>
				<img loading="lazy" src={Infinity} alt="infinity" />
			</InfinityImg>
			<AstronautTxt>
				{isLightTheme ? (
					<img loading="lazy" src={TextInfinityBlack} alt="text" />
				) : (
					<img loading="lazy" src={TextInfinityWhite} alt="text" />
				)}
			</AstronautTxt>
		</AstronautContainer>
	);
};

export default React.memo(InfinityAnimation);
