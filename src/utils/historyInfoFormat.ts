import moment from 'moment';
import { isNullAddress, sliceAddress } from './function';
import { formatNumber } from './number';

export const formatAddressHistory = (
	addressHistory: string,
	userAddress: string | null | undefined
): string => {
	let result: string = '';

	if (!addressHistory || isNullAddress(addressHistory)) {
		result = '-----';
	} else if (addressHistory === userAddress) {
		result = 'You';
	} else {
		result = sliceAddress(addressHistory, 8, 5) ?? '-----';
	}

	return result;
};

export const formatTxHashHistory = (transactionHash: string): string => {
	let result: string = '';

	if (!transactionHash) {
		result = '-----';
	} else {
		result = sliceAddress(transactionHash, 8, 5) ?? '-----';
	}

	return result;
};

export const formatSymbolHistory = (
	priceType: string,
	itemTokenId: string,
	quantity: number
): string => {
	let result: string;
	if (quantity > 0) {
		// transfer NFT
		result = `${priceType.toUpperCase()} #${itemTokenId}`;
	} else if (quantity === 0) {
		// transfer token
		result = priceType.toUpperCase();
	} else {
		result = '-----';
	}

	return result;
};

export const formatQuantityHistory = (tokenPrice: string | number, quantity: number): string => {
	let result: string;
	if (quantity > 0) {
		// transfer NFT
		result = String(quantity);
	} else if (quantity === 0) {
		// transfer token
		result = String(tokenPrice);
	} else {
		result = '-----';
	}

	return formatNumber(result, 0, 4);
};

export const formatTimeHistory = (time: Date | string): string => {
	let result: string;

	if (!time) {
		result = '-----';
	} else {
		result = moment(time).format('MM/DD/YYYY h:mm A');
	}
	return result;
};

export const formatDayMonth = (time: Date | string): string => {
	let result: string;

	if (!time) {
		result = '-----';
	} else {
		result = moment().format('l');
	}
	return result;
};
export const formatTimeHours = (time: Date | string): string => {
	let result: string;

	if (!time) {
		result = '-----';
	} else {
		result = moment().format('LT');
	}
	return result;
};
