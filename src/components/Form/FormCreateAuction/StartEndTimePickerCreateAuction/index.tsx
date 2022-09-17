/* eslint-disable @typescript-eslint/no-unused-vars */
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Box, Stack, Typography, useTheme, FormControlLabel, Checkbox, Link } from '@mui/material';
import moment, { Moment } from 'moment';
import { Title } from 'pages/SellItem/styled';
import React, { Fragment, useEffect, useState } from 'react';
import { DatePickerWrapper, DatePickerTextField, DatePickerVisiblePart } from './styled';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { OptionSelectCustom } from 'models';
import SelectCustom from 'components/CustomField/SelectCustom';

// image
import IconCalendarWhite from 'assets/icons/calendar-white.webp';
import IconCalendarBlack from 'assets/icons/calendar-black.webp';
import { FieldTitleName } from 'components/Form/FormAddOrEditItem/styled';

export interface IDateTimeCustomPickerProps {
	onChangeStartTime: Function;
	onChangeEndTime: Function;
}

const dateRanges: OptionSelectCustom<string>[] = [
	{ name: '7 days (Default)', value: '7' },
	{ name: '1 day', value: '1' },
	{ name: '3 days', value: '3' },
	{ name: '30 days', value: '30' },
	{ name: '60 days', value: '60' },
];

export default function StartEndTimePickerCreateAuction({
	onChangeStartTime,
	onChangeEndTime,
}: IDateTimeCustomPickerProps) {
	const theme = useTheme();
	const isLightTheme = theme.palette.mode === 'light';
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date | null | undefined>(
		moment(new Date()).add(dateRanges[0].value, 'days').toDate()
	);

	const [currentDuration, setCurrentDuration] = useState<any>(dateRanges[0]);
	useEffect(() => {
		onChangeStartTime(startDate);
		onChangeEndTime(endDate);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// change endDate base on startDate and selected duration
	const onChangeDuration = (duration: OptionSelectCustom<string>) => {
		setCurrentDuration(duration);

		const updateEndDate: Date = moment(new Date()).add(duration.value, 'days').toDate();
		setEndDate(updateEndDate);
	};

	const handleChangeStartDate = (newValue: Date | null | undefined) => {
		if (newValue) {
			setStartDate(moment(newValue).toDate());
			// console.log('StartDay', startDate);
			onChangeStartTime(newValue);
		}
	};
	const handleChangeEndDate = (newValue: Date | null | undefined) => {
		if (newValue) {
			setEndDate(moment(newValue).toDate());
			onChangeEndTime(newValue);
		}
	};

	return (
		<Fragment>
			<Box>
				<Fragment>
					<FieldTitleName>Duration</FieldTitleName>
					<SelectCustom
						currentItem={currentDuration}
						listItem={dateRanges}
						onChange={onChangeDuration}
						headerIcon={isLightTheme ? IconCalendarBlack : IconCalendarWhite}
						sx={{
							padding: '15px 15px',
						}}
					/>
				</Fragment>
			</Box>
			<Stack direction="row" alignItems="stretch" sx={{ marginTop: '36px' }}>
				<Box flexGrow="1" sx={{ marginRight: '16px' }}>
					<Stack direction="column" alignItems="flex-start">
						<FieldTitleName>Starting</FieldTitleName>
						<Box
							sx={{
								width: '100%',
							}}
						>
							<DatePickerWrapper>
								<DateTimePicker
									disablePast
									value={startDate}
									onChange={(newValue) => handleChangeStartDate(newValue)}
									renderInput={(params) => <DatePickerTextField {...params} />}
								/>
								<DatePickerVisiblePart>
									<Stack
										alignItems="center"
										justifyContent="space-between"
										direction="row"
									>
										<Typography
											variant="body1"
											sx={{
												[theme.breakpoints.down(420)]: {
													fontSize: 12,
												},
											}}
										>
											{moment(startDate).format('LL')} (
											{moment(startDate).format('LT')})
										</Typography>
										<ArrowDropDownOutlinedIcon sx={{ ml: 2 }} />
									</Stack>
								</DatePickerVisiblePart>
							</DatePickerWrapper>
						</Box>
					</Stack>
				</Box>

				<Box flexGrow="1">
					<Stack direction="column" alignItems="flex-start">
						<FieldTitleName>Ending</FieldTitleName>

						<Box
							sx={{
								width: '100%',
							}}
						>
							<DatePickerWrapper>
								<DateTimePicker
									disablePast
									value={endDate}
									minDate={startDate}
									onChange={(newValue) => handleChangeEndDate(newValue)}
									renderInput={(params) => <DatePickerTextField {...params} />}
								/>
								<DatePickerVisiblePart>
									<Stack
										alignItems="center"
										justifyContent="space-between"
										direction="row"
									>
										<Typography
											variant="body1"
											sx={{
												[theme.breakpoints.down(420)]: {
													fontSize: 12,
												},
											}}
										>
											{moment(endDate).format('LL')} (
											{moment(endDate).format('LT')})
										</Typography>
										<ArrowDropDownOutlinedIcon sx={{ ml: 2 }} />
									</Stack>
								</DatePickerVisiblePart>
							</DatePickerWrapper>
						</Box>
					</Stack>
				</Box>
			</Stack>
		</Fragment>
	);
}
