import React from 'react';
import { Box } from '@mui/material';
import { LazyLoadingImg } from './styled';
import ImgLoading from 'assets/forbit-loading.svg';

export interface ILazyLoadImgProps {}

export default function LazyLoadImg(props: ILazyLoadImgProps) {
	return (
		<>
			<Box sx={{ mt: 14 }}>
				<LazyLoadingImg>
					<img src={ImgLoading} alt="Loading" />
				</LazyLoadingImg>
			</Box>
		</>
	);
}
