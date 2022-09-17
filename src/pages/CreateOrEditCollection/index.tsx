/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'react-router-dom';
//mui
import { Container } from '@mui/material';
//components
import FormAddOrEditCollection, {
	IFormAddOrEditCollectionInputs,
} from 'components/Form/FormAddOrEditCollection';
import Loading from 'components/CustomUI/LoadingPage';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { selectAddress, selectChainId } from 'redux/slices/web3InfoSlice';
//utils
import { convertBuffer, addIPFS } from 'utils';
//models
import {
	Collection,
	CreateCollectionInput,
	ListResponse,
	Response,
	UploadItemResponse,
} from 'models';
import collectionApi from 'apis/collectionApi';
import uploadApi from 'apis/uploadApi';
import { PATH_COLLECTION } from 'routes/path';

export interface CreateCollectionProps {}

export default function CreateOrEditCollection(props: CreateCollectionProps) {
	const { pathname } = useLocation();
	const isEdit = pathname.includes('edit');
	let { collectionId } = useParams();
	const navigate = useNavigate();

	const [collection, setCollection] = useState<Collection>();
	const [loading, setLoading] = useState<boolean>(false);
	const [collectionName, setCollectionName] = useState<string>('');
	const [oldCollectionName, setOldCollectionName] = useState<string>('');
	const [existed, setExisted] = useState<boolean>(false);
	const [loadingCheckName, setLoadingCheckName] = useState<boolean>(false);
	const [listCategory, setListCategory] = useState<any>([]);

	//selector
	const address = useSelector(selectAddress);
	const chainId = useSelector(selectChainId);

	// fetch Collection by id
	useEffect(() => {
		if (!collectionId) return;
		(async () => {
			try {
				setLoading(true);
				const res: Response<any> = await collectionApi.getCollectionById(collectionId);

				const collectionResponse: Collection = res.data;
				setCollection(collectionResponse);
				setOldCollectionName(collectionResponse.collectionName);

				setLoading(false);
			} catch (error: any) {
				setLoading(false);
				toast.error(error.message);
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collectionId]);

	// Check exist collection's name
	useEffect(() => {
		if (collectionName === '' || (isEdit && collectionName === oldCollectionName)) return;
		(async () => {
			setLoadingCheckName(true);

			const res: Response<any> = await collectionApi.checkExistCollectionName(
				collectionName,
				chainId
			);
			setExisted(res.data);
			setLoadingCheckName(false);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId, collectionName]);

	// create or update collection function
	const onSubmit = async (data: IFormAddOrEditCollectionInputs) => {
		const logo: any = data.logo;
		const background: any = data.background;
		let logoURL: string = '';
		let backgroundURL: string = '';

		console.log('form', data);

		try {
			if (typeof logo === 'string') {
				logoURL = logo;
			} else {
				const logoForm = new FormData();
				logoForm.append('file', logo.raw);
				const res: Response<any> = await uploadApi.uploadCollectionMedia(logoForm);
				logoURL = res.data;
			}

			if (typeof background === 'string') {
				backgroundURL = background;
			} else {
				const backgroundForm = new FormData();
				backgroundForm.append('file', background.raw);
				const res: Response<any> = await uploadApi.uploadCollectionMedia(backgroundForm);
				backgroundURL = res.data;
			}

			if (!isEdit) {
				const newData: CreateCollectionInput = {
					...data,
					logo: logoURL,
					background: backgroundURL,
					userAddress: address!,
					collectionStandard: 'ERC1155',
				};

				await collectionApi.createCollection(newData);
				navigate(PATH_COLLECTION.myCollection);
				toast.success('Create collection success!!');
			} else {
				if (collection && collectionId) {
					const updateData: CreateCollectionInput = {
						...collection,
						...data,
						logo: logoURL,
						background: backgroundURL,
						collectionStandard: 'ERC1155',
					};

					await collectionApi.editCollection(updateData, collectionId);
					navigate(`${PATH_COLLECTION.detail}/${collectionId}`);
					toast.success('Update collection success!!');
				}
			}
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	// Check collection nam already existed
	const checkExistCollectionName = (value: any) => {
		if (value === '') {
			setExisted(false);
		}
		setCollectionName(value);
	};

	return (
		<Container sx={{ mt: 14 }}>
			{loading ? (
				<Loading />
			) : (
				<FormAddOrEditCollection
					isEdit={isEdit}
					onSubmit={onSubmit}
					currentCollection={collection}
					checkExistCollectionName={checkExistCollectionName}
					existed={existed}
					loadingCheckName={loadingCheckName}
				/>
			)}
		</Container>
	);
}
