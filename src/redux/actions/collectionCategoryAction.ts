import collectionApi from 'apis/collectionApi';
import { CollectionCategory, ListResponseNonPaging } from 'models';
import { toast } from 'react-toastify';
import {
	fetchCollectionCategorySuccess,
	startLoading,
	hasError,
} from 'redux/slices/collectionCategorySlice';
import { dispatch } from 'redux/store';

export function fetchListCollectionCategory() {
	return async () => {
		dispatch(startLoading());
		try {
			const res: ListResponseNonPaging<CollectionCategory> =
				await collectionApi.getListCollectionCategory();
			dispatch(fetchCollectionCategorySuccess(res));
		} catch (error: any) {
			dispatch(hasError(error.message));
			toast.error(error.message);
		}
	};
}
