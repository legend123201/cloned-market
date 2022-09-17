import numeral from 'numeral';

export const formatNumberWithText = (
	amount: number | string,
	minNumberLimitAfterComma: number,
	maxNumberLimitAfterComma?: number
): string => {
	if (maxNumberLimitAfterComma) {
		return numeral(amount).format(
			`0.${'0'.repeat(minNumberLimitAfterComma)}[${'0'.repeat(
				maxNumberLimitAfterComma - minNumberLimitAfterComma
			)}]a`
		);
	} else {
		return numeral(amount)
			.format(`0.${'0'.repeat(minNumberLimitAfterComma)}a`)
			.toUpperCase();
	}
};

export const formatNumber = (
	amount: number | string,
	minNumberLimitAfterComma: number,
	maxNumberLimitAfterComma?: number
): string => {
	if (maxNumberLimitAfterComma) {
		return numeral(amount).format(
			`0,0.${'0'.repeat(minNumberLimitAfterComma)}[${'0'.repeat(
				maxNumberLimitAfterComma - minNumberLimitAfterComma
			)}]`
		);
	} else {
		return numeral(amount).format(`0,0.${'0'.repeat(minNumberLimitAfterComma)}`);
	}
};

export function avoidFloatingPoint(number: number): number {
	// Ex floating point (2 kinds: underflow, overflow): 0.1 + 0.7, 0.1 * 0.05, ....
	return Number(number.toFixed(8));
}

export function fData(number: string | number) {
	return numeral(number).format('0.0 b');
}

export function hexToDecimal(hex: string): number {
	return parseInt(hex, 16);
}

export function decimalToHex(number: number): string {
	return number.toString(16);
}
