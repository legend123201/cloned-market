/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// mui
import { Box, Checkbox, CircularProgress, Stack, Typography } from '@mui/material';
// components
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import Modal from 'components/CustomUI/Modal';
import FormUnpackBox, { IFormUnpackBoxInputs } from 'components/Form/FormUnpackBox';
import NFTItem from 'components/CustomUI/Card/NFTItemCard';
// images
import CardIcon from 'assets/icons/card.webp';
// redux
import { useSelector } from 'react-redux';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
import { selectLoading, selectNftItem } from 'redux/slices/nftItemByItemIdSlice';
// actions
import { BoxAction } from 'redux/actions/OrderAction/boxAction';
// models
import { NFT, UnpackErc721Input, UnpackErc1155Input } from 'models';
// styled
import { ItemWrapper } from './styled';
// path
import { PATH_ITEM, PATH_PAGE } from 'routes/path';
// order actions
const { UnpackErc721, UnpackErc1155 } = BoxAction();

export interface IModalUnpackProps {
	isOpen: boolean;
	setIsOpen: Function;
	item: NFT;
	refetchApi: Function;
}

export default function ModalUnpack({ isOpen, setIsOpen, item, refetchApi }: IModalUnpackProps) {
	const navigate = useNavigate();

	// useState
	const [checked, setChecked] = useState<boolean>(false);
	const [isOpeningBox, setIsOpeningBox] = useState<boolean>(false);
	const [arrItemIdUnpacked, setArrItemIdUnpacked] = useState<string[]>([]);

	// useSelector
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	// functions
	const executeAfterUnpackBox = (arrItemId: string[]) => {
		setArrItemIdUnpacked(arrItemId);
	};

	const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	const handleUnpackBox721 = async () => {
		if (!item || !item.collectionInfo || !userAddress || !chainId) {
			console.log('Missing Field when unpack box 721!');
			return;
		}

		setIsOpeningBox(true);
		try {
			const data: UnpackErc721Input = {
				chainId,
				userAddress,
				collectionAddress: item.collectionInfo.collectionAddress,
				itemTokenId: item.itemTokenId,
				itemId: item._id,
				callback: executeAfterUnpackBox,
			};

			await UnpackErc721(data);
		} catch (error) {
			console.log(error);
			toast.warning('Some error occurred when unpacking your box!');
		} finally {
			setIsOpeningBox(false);
		}
	};

	const handleUnpackBox1155 = async (data: IFormUnpackBoxInputs) => {
		if (!item || !item.collectionInfo || !userAddress || !chainId) {
			console.log('Missing Field when unpack box 1155!');
			return;
		}

		try {
			const dataUnpack: UnpackErc1155Input = {
				...data,
				chainId,
				userAddress,
				collectionAddress: item.collectionInfo.collectionAddress,
				itemTokenId: item.itemTokenId,
				itemId: item._id,
				callback: executeAfterUnpackBox,
			};

			await UnpackErc1155(dataUnpack);
		} catch (error) {
			console.log(error);
			toast.warning('Some error occurred when unpacking your box!');
		}
	};

	return (
		<Modal
			onOpen={isOpen}
			mainHeader={!(arrItemIdUnpacked.length > 0) ? 'Unpack Box' : 'Congratulations'}
			style={{ maxWidth: '450px', overflowY: 'auto' }}
			allowClose={!isOpeningBox || !(arrItemIdUnpacked.length > 0)}
			onClose={() => {
				setIsOpen(false);
				setArrItemIdUnpacked([]);
			}}
		>
			{!(arrItemIdUnpacked.length > 0) ? (
				item && item.itemStandard.includes('1155') ? (
					<FormUnpackBox currentBox={item} onSubmit={handleUnpackBox1155} />
				) : (
					<>
						<Typography variant="body2">
							Opening my box, i will get NFTs randomly from MetaSpacecy Collection. I
							will be the creator and have full rights to the NFTs.
						</Typography>
						<Stack
							direction="row"
							alignItems="center"
							sx={{ marginLeft: '-10px', mt: 2, mb: 2 }}
						>
							<Checkbox
								checked={checked}
								aria-checked="false"
								onChange={handleChangeCheckBox}
							/>
							<Typography variant="body2" component="span">
								I understand.
							</Typography>
						</Stack>
						<ButtonGradient
							disabled={!checked || isOpeningBox}
							onClick={() => {
								handleUnpackBox721();
							}}
							sx={{ mb: 2, mt: 1 }}
						>
							{isOpeningBox && (
								<CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />
							)}

							<Typography variant="body1" sx={{ ml: 1 }} noWrap>
								{isOpeningBox ? 'Opening...' : 'Open the box'}
							</Typography>
						</ButtonGradient>
					</>
				)
			) : (
				<Stack alignItems="center" sx={{ width: '100%' }}>
					<Typography variant="body1" sx={{ textAlign: 'center' }}>
						You have received a new NFT from MetaSpacecy Collection.
					</Typography>

					{/* <ItemWrapper>
									<NFTItemCard itemId={{ _id: itemIdUnpacked }} />
								</ItemWrapper>

								<ButtonGradient
									disabled={false}
									onClick={() => {
										navigate(`${PATH_ITEM.detail}/${itemIdUnpacked}`);
									}}
									sx={{ mb: 2, mt: 3, width: '200px' }}
								>
									<Typography variant="body1" sx={{ ml: 1 }} noWrap>
										View now
									</Typography>
								</ButtonGradient> */}

					<ButtonGradient
						disabled={false}
						onClick={() => {
							navigate(`${PATH_PAGE.user}`);
						}}
						sx={{ mb: 2, mt: 3, width: '200px' }}
					>
						<Typography variant="body1" sx={{ ml: 1 }} noWrap>
							View your asset
						</Typography>
					</ButtonGradient>
				</Stack>
			)}
		</Modal>
	);
}
