import { BigNumber, FixedNumber } from 'ethers';

export function toFixed(x: any) {
	if (Math.abs(x) < 1.0) {
		var e = parseInt(x.toString().split('e-')[1]);
		if (e) {
			x *= Math.pow(10, e - 1);
			x = '0.' + new Array(e).join('0') + x.toString().substring(2);
		}
	} else {
		e = parseInt(x.toString().split('+')[1]);
		if (e > 20) {
			e -= 20;
			x /= Math.pow(10, e);
			x += new Array(e + 1).join('0');
		}
	}
	return x;
}

export const parseUnits = (val: string | Number, decimal: string | Number): BigNumber => {
	// default of FixedNumber is mul the value with 10**18
	const valToFixedNumber: FixedNumber = FixedNumber.from(String(val));

	if (Number(decimal) <= 18) {
		return BigNumber.from(valToFixedNumber).div(BigNumber.from(10).pow(18 - Number(decimal)));
	} else {
		return BigNumber.from(valToFixedNumber).mul(BigNumber.from(10).pow(Number(decimal) - 18));
	}
};
