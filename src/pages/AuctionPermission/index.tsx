/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import igoApi from 'apis/igoApi';
import FormAuctionPermission, {
	IFormAuctionPermissionValue,
} from 'components/Form/FormAuctionPermission';
import { SwiperSlideItemAuctionDetail } from 'components/pages/AuctionDetail/ItemImage/styled';
import Modal from 'components/CustomUI/Modal';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import { useNavigate } from 'react-router-dom';
import { PATH_AUCTION } from 'routes/path';

export interface IAuctionPermissionProps {}

export default function AuctionPermission(props: IAuctionPermissionProps) {
	const [modal, setModal] = useState<boolean>(false);
	const navigate = useNavigate();
	// useEffect
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onSubmit = async (data: IFormAuctionPermissionValue) => {
		const newData = {
			...data,
			typeINO: 1,
		};

		try {
			await igoApi.sendRequestIgo(newData);
			setModal(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Box sx={{ mt: 14 }}>
				<FormAuctionPermission onSubmit={onSubmit} />
			</Box>
			<Box>
				<Modal
					onOpen={modal}
					mainHeader={`Buy Box`}
					style={{ maxWidth: '400px' }}
					allowClose={false}
					onClose={() => {
						setModal(false);
					}}
				>
					<Box sx={{ margin: '12px 0' }}>
						<Typography>
							We have received your information, we will try to respond to your
							request as soon as possible! Thank
						</Typography>
					</Box>
					<Box>
						<ButtonGradient
							onClick={() => {
								navigate(`${PATH_AUCTION.root}`);
							}}
						>
							<Typography>Close</Typography>
						</ButtonGradient>
					</Box>
				</Modal>
			</Box>
		</>
	);
}
