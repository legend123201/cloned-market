/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// mui
import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// component
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import Modal from 'components/CustomUI/Modal';
import SelectCustom from 'components/CustomField/SelectCustom';
import FieldInput from 'components/CustomField/FieldInput';
// redux
import { useSelector } from 'react-redux';
import { selectCollectionItem } from 'redux/slices/collectionSlice';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
// actions
import { BoxAction } from 'redux/actions/OrderAction/boxAction';
// models
import { MintNewBoxErc721Input, MintNewBoxErc1155Input, BuyBoxInput } from 'models';
// path
import { PATH_COLLECTION } from 'routes/path';
import FormMintNewBox, { IFormMintNewBoxInputs } from 'components/Form/FormMintNewBox';
import FormBuyBox, { IFormBuyBoxInputs } from 'components/Form/FormBuyBox';
// utils
import { erc20function, isOurCollection1155Address } from 'utils';
import { BigNumber } from 'ethers';
// constants
import { CONTRACT } from '../../../../constants';
// order actions
const { MintNewBoxErc721, MintNewBoxErc1155, BuyBox } = BoxAction();

export interface IButtonAddItemProps {
	refetchApi: Function;
}

export default function ButtonAddItem({ refetchApi }: IButtonAddItemProps) {
	const navigate = useNavigate();
	const { collectionId } = useParams();

	// useState
	const [modal, setModal] = useState<boolean>(false);

	// useSelector
	const collection = useSelector(selectCollectionItem);
	const userAddress = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	// functions
	const handleMintNewBox = async (data: IFormMintNewBoxInputs) => {
		if (!userAddress || !collectionId || !collection || !chainId) {
			console.log('Missing field when minting new item');
			return;
		}

		const is1155Standard = collection.collectionStandard.includes('1155');

		try {
			const dataMint: MintNewBoxErc721Input | MintNewBoxErc1155Input = {
				...data,
				chainId,
				userAddress,
				collectionId,
				collectionAddress: collection.collectionAddress,
				refetchApi,
				dataMint: '0x00',
			};

			if (is1155Standard) {
				await MintNewBoxErc721(dataMint as MintNewBoxErc721Input);
			} else {
				await MintNewBoxErc1155(dataMint as MintNewBoxErc1155Input);
			}
		} catch (error) {
			console.log(error);
			toast.warning('Some error occurred while minting new item!');
		}
	};

	const handleBuyBox = async (data: IFormBuyBoxInputs) => {
		console.log(data);

		if (!userAddress || !chainId || !collection) {
			console.log('Missing field when perchasing box!');
			return;
		}

		try {
			// check balance
			const totalPrice: number = 50000 * data.amount;

			const totalPriceToWei: BigNumber = await erc20function().changeTokenToWei(
				CONTRACT[chainId].MetaSpacecyToken,
				totalPrice
			);

			const isEnough: boolean = await erc20function().checkBalance(
				CONTRACT[chainId].MetaSpacecyToken,
				userAddress,
				totalPriceToWei
			);

			if (!isEnough) {
				toast.error('Not enough token to purchase!');
				return;
			}

			// buy box
			const dataBuy: BuyBoxInput = {
				chainId,
				userAddress,
				amount: data.amount,
				optionId: data.boxTokenId,
				itemId: data.boxId,
				totalPriceToWei,
				callback: () => {},
			};

			await BuyBox(dataBuy);
		} catch (error) {
			toast.error('Some error occur when perchasing box!');
			console.log(error);
		}
	};

	return (
		<>
			{/* category = 7 : box */}
			{collection && collection.category === 7 ? (
				collection.collectionStandard.includes('1155') ? (
					<>
						<Box>
							<ButtonGradient
								sx={{ width: 'fit-content', py: 1 }}
								onClick={() => setModal(true)}
								disabled={!userAddress || !collection}
							>
								Buy box
							</ButtonGradient>
						</Box>

						<Modal
							onOpen={modal}
							mainHeader="Buy Box"
							style={{ maxWidth: '450px' }}
							allowClose={true}
							onClose={() => {
								setModal(false);
							}}
						>
							<FormBuyBox onSubmit={handleBuyBox} />
						</Modal>
					</>
				) : (
					<>
						<Tooltip title="Mint New Box" placement="top" arrow>
							<Box>
								<ButtonGradient
									sx={{ width: 'fit-content', py: 1 }}
									onClick={() => setModal(true)}
									disabled={
										!userAddress ||
										!collection ||
										collection.userAddress.toLowerCase() !==
											userAddress.toLowerCase()
									}
								>
									<AddIcon />
								</ButtonGradient>
							</Box>
						</Tooltip>

						<Modal
							onOpen={modal}
							mainHeader="Mint New Item"
							style={{ maxWidth: '450px', overflowY: 'auto' }}
							allowClose={true}
							onClose={() => {
								setModal(false);
							}}
						>
							<FormMintNewBox
								is1155Standard={collection.collectionStandard.includes('1155')}
								onSubmit={handleMintNewBox}
							/>
						</Modal>
					</>
				)
			) : (
				<Tooltip title="Add Item" placement="top" arrow>
					<Box>
						<ButtonGradient
							sx={{ width: 'fit-content', py: 1 }}
							onClick={() =>
								navigate(`${PATH_COLLECTION.createItem}/${collectionId}`)
							}
							disabled={
								!userAddress ||
								!chainId ||
								!collection ||
								collection.userAddress.toLowerCase() !==
									userAddress.toLowerCase() ||
								!isOurCollection1155Address(collection.collectionAddress, chainId)
							}
						>
							<AddIcon />
						</ButtonGradient>
					</Box>
				</Tooltip>
			)}
		</>
	);
}
