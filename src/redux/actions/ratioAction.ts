import { dispatch } from '../store';
import commonApi from 'apis/commonApi';
import { startLoading, hasError, setRatioSuccess } from 'redux/slices/ratioSlice';
import { Response } from 'models';

export function fetchRatio(data: any) {
	const { base, quote } = data;
	return async () => {
		dispatch(startLoading());
		try {
			const res: Response<any> = await commonApi.getQuote(data);
			dispatch(setRatioSuccess({ [`${base}${quote}`]: res.data }));
		} catch (error) {
			dispatch(hasError(error));
		}
	};
}
