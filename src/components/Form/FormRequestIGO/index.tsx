/* eslint-disable @typescript-eslint/no-unused-vars */

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Checkbox, CircularProgress, Stack, Typography } from '@mui/material';
import FieldInput from 'components/CustomField/FieldInput';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Asterisk, ErrorMessage } from '../Common/styled';
import { FieldTitleName, PageTitle } from '../FormAddOrEditItem/styled';
import * as yup from 'yup';
import ButtonGradient from 'components/CustomUI/ButtonGradient';
import DateTimePickerCustom from './DateTimePickerCustom';
import moment from 'moment';
import DropDown from 'components/CustomUI/DropDown';
import { DropDownWrapper } from 'components/CustomUI/DropDown/styled';
import { ListOption } from 'components/CustomField/SelectCustom/styled';
import CheckIcon from '@mui/icons-material/Check';
import {
	CheckIconWrapperInCreateAution,
	ItemImageInCreatAuction,
} from '../FormCreateAuction/styled';
import ETHIcon from 'assets/icons/Network/ether-new.png';
import BNBIcon from 'assets/icons/Network/bnb-new.webp';
import DropDownIcon from 'assets/icons/icon-down-black.svg';
import TetherUST from 'assets/icons/tether-usdt-icon.svg';
import { DropdownWrapper } from 'components/CustomUI/FilterItemGroup/Common/styled';
import { ConatainerFieldInput, FieldRenderDropdown, OptionItem } from './styled';
import { TextArea } from 'components/CustomField/FieldTextArea/styled';
import FieldTextArea from 'components/CustomField/FieldTextArea';

export interface IFormRequestIGOProps {
	onSubmit: SubmitHandler<IFormRequestIGOPropsValue>;
}

interface Selected {
	name: string;
}
const networkToken = [
	{
		name: 'ETH',
		logo: ETHIcon,
		chainId: 4,
	},
	{
		name: 'BNB',
		logo: BNBIcon,
		chainId: 97,
	},
];

const listTokenPayment = [
	{
		name: 'USDT',
		logo: '',
	},
	{
		name: 'FBS',
		logo: '',
	},
];

export interface IFormRequestIGOPropsValue {
	projectName: string;
	companyName: string;
	email: string;
	network: number;
	walletAddress: string;
	collectionAddress: string;
	projectDescription: string;
	note: string;
	projectWebsite: string;
	networkPaymentName: string;
	networkPaymentPrice: number;
	stableCoinPaymentPrice: number;
	nativeTokenPaymentPrice: number;
	startTime: number;
	endTime: number;
}
interface listPayment {
	name: string;
	price: number;
}

export default function FormRequestIGO({ onSubmit }: IFormRequestIGOProps) {
	const [date1, setDate1] = useState<Date>(new Date());
	const [date2, setDate2] = useState<Date>(new Date());
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);
	const [activeDropDown1, setActiveDropDown1] = useState<boolean>(false);
	const [selected, setSelected] = useState<Selected[]>([]);
	const [arrItemSelected, setArrItemSelected] = useState<any>([]);
	const [network, setNetwork] = useState<string>('ETH');
	const [network1, setNetwork1] = useState<string>('ETH');
	const [networkLogo, setNetworkLogo] = useState<string>(networkToken[0].logo);
	const [networkLogo1, setNetworkLogo1] = useState<string>(networkToken[0].logo);
	const [listPayment, setListPayment] = useState<any>([]);
	const [chooseChainId, setChooseChainId] = useState<number>(97);

	const schema = yup
		.object({
			projectName: yup.string().required(),
			companyName: yup.string().required(),
			email: yup.string().required(),
			network: yup.number().required(),
			walletAddress: yup.string().required(),
			collectionAddress: yup.string().required(),
			projectDescription: yup.string().required(),
			projectWebsite: yup.string().required(),
			note: yup.string(),
			networkPaymentName: yup.string().required(),
			networkPaymentPrice: yup.number().required(),
			stableCoinPaymentPrice: yup.number().required(),
			nativeTokenPaymentPrice: yup.number().required(),
			startTime: yup.number().required(),
			endTime: yup.number().required(),
		})
		.required();

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<IFormRequestIGOPropsValue>({
		resolver: yupResolver(schema),
	});

	// useEffect
	// useEffect(() => {
	// 	window.scrollTo({ top: 0, behavior: 'smooth' });
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	useEffect(() => {
		const newValue1 = Number(moment(date1).format('X'));
		const newValue2 = Number(moment(date2).format('X'));
		setValue('startTime', newValue1);
		setValue('endTime', newValue2);
		setValue('networkPaymentName', network);
		setValue('network', chooseChainId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [date1, date2, chooseChainId, network]);

	// useEffect
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderButtonContent = () => {
		return (
			<ConatainerFieldInput>
				<FieldRenderDropdown>
					<Box sx={{ width: '24px' }}>
						<img src={networkLogo} alt={network} />
					</Box>
					<Typography>{network}</Typography>
				</FieldRenderDropdown>
				<Box>
					<img src={DropDownIcon} alt="Drop down" />
				</Box>
			</ConatainerFieldInput>
		);
	};
	const renderButtonContent1 = () => {
		return (
			<ConatainerFieldInput>
				<FieldRenderDropdown>
					<Box sx={{ width: '24px' }}>
						<img src={networkLogo} alt={network} />
					</Box>
					<Typography>{network}</Typography>
				</FieldRenderDropdown>
				<Box>
					<img src={DropDownIcon} alt="Drop down" />
				</Box>
			</ConatainerFieldInput>
		);
	};

	// Handle click option
	const handleClickOption = (name: string, logo: string) => {
		setNetwork(name);
		setNetworkLogo(logo);
		setActiveDropDown(false);
	};
	const handleClickOption1 = (name: string, logo: string, chainId: number) => {
		setNetwork1(name);
		setNetworkLogo1(logo);
		setActiveDropDown1(false);
		setChooseChainId(chainId);
	};

	// Render Dropdown Item NetWork Payment
	const renderDropdownContent = () => {
		return (
			<Box sx={{ width: '100%', right: '0' }}>
				<ListOption sx={{ mt: 0.5 }}>
					{networkToken.map((item: any, idx: number) => {
						const isItemSelected =
							selected.find(
								(itemSelected: Selected) => itemSelected.name === item.name
							) !== undefined;
						return (
							<OptionItem
								key={idx}
								onClick={() => {
									handleClickOption(item.name, item.logo);
								}}
								sx={{ marginTop: '8px' }}
							>
								<Stack
									direction="row"
									alignItems="center"
									gap={1}
									sx={{
										background: '#0a2e4b',
										height: '48px',
										borderRadius: '8px',
										borderBottom: '2px solid blue',
										width: '100%',
									}}
								>
									<Box sx={{ width: '24px' }}>
										<img src={item.logo} alt={item.name} />
									</Box>
									<Typography>{item.name}</Typography>
								</Stack>

								{isItemSelected && (
									<CheckIconWrapperInCreateAution>
										<CheckIcon sx={{ width: '100%', height: '100%' }} />
									</CheckIconWrapperInCreateAution>
								)}
							</OptionItem>
						);
					})}
				</ListOption>
			</Box>
		);
	};

	// Render Dropdown Item NetWork
	const renderDropdownContent1 = () => {
		return (
			<Box sx={{ width: '100%', right: '0' }}>
				<ListOption sx={{ mt: 0.5 }}>
					{networkToken.map((item: any, idx: number) => {
						const isItemSelected =
							selected.find(
								(itemSelected: Selected) => itemSelected.name === item.name
							) !== undefined;
						return (
							<OptionItem
								key={idx}
								onClick={() => {
									handleClickOption1(item.name, item.logo, item.chainId);
								}}
								sx={{ marginTop: '8px' }}
							>
								<Stack
									direction="row"
									alignItems="center"
									gap={1}
									sx={{
										background: '#0a2e4b',
										height: '48px',
										borderRadius: '8px',
										borderBottom: '2px solid blue',
										width: '100%',
									}}
								>
									<Box sx={{ width: '24px' }}>
										<img src={item.logo} alt={item.name} />
									</Box>
									<Typography>{item.name}</Typography>
								</Stack>

								{isItemSelected && (
									<CheckIconWrapperInCreateAution>
										<CheckIcon sx={{ width: '100%', height: '100%' }} />
									</CheckIconWrapperInCreateAution>
								)}
							</OptionItem>
						);
					})}
				</ListOption>
			</Box>
		);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{
				maxWidth: '1200px',
				margin: '0px auto',
				padding: '8px',
			}}
		>
			<Box>
				<PageTitle sx={{ textAlign: 'left', fontWeight: '400' }}>
					SEND REQUEST CREATE IGO
				</PageTitle>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Name your project <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Name your project"
						registerHookForm={{ ...register('projectName') }}
					/>
					{errors.projectName?.message && (
						<ErrorMessage>{errors.projectName?.message}</ErrorMessage>
					)}
				</Box>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Name your Company <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Name your Company"
						registerHookForm={{ ...register('companyName') }}
					/>
					{errors.companyName?.message && (
						<ErrorMessage>{errors.companyName?.message}</ErrorMessage>
					)}
				</Box>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Your Email
						<Asterisk />
					</FieldTitleName>
					<FieldInput
						type="email"
						placeholder="Your Email"
						registerHookForm={{ ...register('email') }}
					/>
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
				</Box>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Network <Asterisk />
					</FieldTitleName>
					<DropDown
						sx={{ left: '0px', right: '0px' }}
						activeDropDown={activeDropDown1}
						setActiveDropDown={setActiveDropDown1}
						buttonContent={renderButtonContent1()}
						dropdownContent={renderDropdownContent1()}
					/>
					{errors.network?.message && (
						<ErrorMessage>{errors.network?.message}</ErrorMessage>
					)}
				</Box>

				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Wallet Address <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Wallet Address"
						registerHookForm={{ ...register('walletAddress') }}
					/>
					{errors.walletAddress?.message && (
						<ErrorMessage>{errors.walletAddress?.message}</ErrorMessage>
					)}
				</Box>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Collection Address <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Collection Address"
						registerHookForm={{ ...register('collectionAddress') }}
					/>
					{errors.collectionAddress?.message && (
						<ErrorMessage>{errors.collectionAddress?.message}</ErrorMessage>
					)}
				</Box>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Project Website <Asterisk />
					</FieldTitleName>
					<FieldInput
						type="text"
						placeholder="Project Website"
						registerHookForm={{ ...register('projectWebsite') }}
					/>
					{errors.projectWebsite?.message && (
						<ErrorMessage>{errors.projectWebsite?.message}</ErrorMessage>
					)}
				</Box>

				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Choose Network Token Payment <Asterisk />
					</FieldTitleName>
					<Stack direction="row" gap={2} mt={2}>
						<DropDown
							sx={{ left: '0px', right: '0px' }}
							activeDropDown={activeDropDown}
							setActiveDropDown={setActiveDropDown}
							buttonContent={renderButtonContent()}
							dropdownContent={renderDropdownContent()}
						/>
						<FieldInput
							type="number"
							placeholder="Amount"
							registerHookForm={{ ...register('networkPaymentPrice') }}
						/>
					</Stack>

					{errors.projectDescription?.message && (
						<ErrorMessage>{errors.projectDescription?.message}</ErrorMessage>
					)}
				</Box>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Price <Asterisk />
					</FieldTitleName>
					<Stack direction="row" gap={2} flex="1">
						<Stack direction="row" gap={2} mt={2} flex="1">
							<FieldRenderDropdown>
								<Box sx={{ width: '24px' }}>
									<img src={TetherUST} alt="tether" />
								</Box>
								<Typography>USDT</Typography>
							</FieldRenderDropdown>
							<FieldInput
								type="number"
								placeholder="Amount"
								registerHookForm={{ ...register('stableCoinPaymentPrice') }}
							/>
						</Stack>
						<Stack direction="row" gap={2} mt={2} flex="1">
							<FieldRenderDropdown>
								<Box sx={{ width: '24px' }}>
									<img src={TetherUST} alt="tether" />
								</Box>
								<Typography>FBS</Typography>
							</FieldRenderDropdown>
							<FieldInput
								type="number"
								placeholder="Amount"
								registerHookForm={{ ...register('nativeTokenPaymentPrice') }}
							/>
						</Stack>
					</Stack>

					{errors.projectDescription?.message && (
						<ErrorMessage>{errors.projectDescription?.message}</ErrorMessage>
					)}
				</Box>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Start Time <Asterisk />
					</FieldTitleName>

					<DateTimePickerCustom dateTime={date1} setDateTime={setDate1} />
				</Box>
				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						End Time <Asterisk />
					</FieldTitleName>

					<DateTimePickerCustom dateTime={date2} setDateTime={setDate2} />
				</Box>

				<Box sx={{ marginTop: 4 }}>
					<FieldTitleName>
						Project Description <Asterisk />
					</FieldTitleName>
					<FieldTextArea
						rows={4}
						cols={4}
						placeholder="Project Description"
						registerHookForm={{ ...register('projectDescription') }}
					/>
					{errors.projectDescription?.message && (
						<ErrorMessage>{errors.projectDescription?.message}</ErrorMessage>
					)}
				</Box>

				<Stack direction="row" gap={0.5} alignItems="center" sx={{ marginTop: 1 }}>
					<Checkbox required />
					<Typography>By tick, i asdkamsd</Typography>
				</Stack>
				<Box sx={{ width: '250px', marginTop: '24px', textAlign: 'left' }}>
					<ButtonGradient type="submit">
						<Typography>Send</Typography>
					</ButtonGradient>
				</Box>
			</Box>
		</form>
	);
}
