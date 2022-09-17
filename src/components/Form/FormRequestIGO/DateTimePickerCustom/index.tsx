/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
// mui
import { Stack, Typography } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
// styled
import { DatePickerTextField, DatePickerVisiblePart, DatePickerWrapper } from './styled';
// utils
import moment, { Moment } from 'moment';

export interface IDateTimePickerCustomProps {
	dateTime: Date;
	setDateTime: Function;
}

export default function DateTimePickerCustom({
	dateTime,
	setDateTime,
}: IDateTimePickerCustomProps) {
	// functions
	const handleChangeDateTime = (newValue: Date | null) => {
		// newValue actually is 'moment' type, but typescript say it is Date
		const newValueToDate: Date = moment(newValue).toDate();
		setDateTime(newValueToDate);
	};

	return (
		<DatePickerWrapper>
			<DateTimePicker
				disablePast
				value={dateTime}
				minDate={new Date()}
				onChange={(newValue) => handleChangeDateTime(newValue)}
				renderInput={(params) => <DatePickerTextField {...params} />}
			/>
			<DatePickerVisiblePart>
				<Stack
					alignItems="center"
					justifyContent="space-between"
					sx={{ width: '100%' }}
					direction="row"
				>
					<Typography variant="body1">
						{moment(dateTime).format('LL')} ({moment(dateTime).format('LT')})
					</Typography>
					<ArrowDropDownOutlinedIcon sx={{ ml: 2 }} />
				</Stack>
			</DatePickerVisiblePart>
		</DatePickerWrapper>
	);
}
