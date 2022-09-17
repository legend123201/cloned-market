/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { CountdownContain, FireIcon, LeftText, TimeArticle, TimeTitle, TimeValue } from './styled';
import { Typography } from '@mui/material';

export interface ICountDownProps {
	timeEnd: number;
	className: string;
	executeZero?: Function;
}

export default function CountDown({ timeEnd, executeZero }: ICountDownProps) {
	const [days, setDays] = useState('00');
	const [hours, setHours] = useState('00');
	const [minutes, setMinutes] = useState('00');
	const [seconds, setSeconds] = useState('00');

	useEffect(() => {
		const interval = setInterval(() => {
			const today = new Date().getTime();
			if (timeEnd > today) {
				const timeDiff = timeEnd - today;

				const seconds = 1000;
				const minutes = seconds * 60;
				const hours = minutes * 60;
				const days = hours * 24;

				let timeDays: any = Math.floor(timeDiff / days);
				let timeHours: any = Math.floor((timeDiff % days) / hours);
				let timeMinutes: any = Math.floor((timeDiff % hours) / minutes);
				let timeSeconds: any = Math.floor((timeDiff % minutes) / seconds);

				// timeDays = timeDays < 10 ? '0' + timeDays : timeDays;
				timeHours = timeHours < 10 ? '0' + timeHours : timeHours;
				timeMinutes = timeMinutes < 10 ? '0' + timeMinutes : timeMinutes;
				timeSeconds = timeSeconds < 10 ? '0' + timeSeconds : timeSeconds;

				if (
					executeZero &&
					Number(timeDays) === 0 &&
					Number(timeHours) === 0 &&
					Number(timeMinutes) === 0 &&
					Number(timeSeconds) === 0
				) {
					console.log('end time');
					executeZero();
				}

				setDays(timeDays);
				setHours(timeHours);
				setMinutes(timeMinutes);
				setSeconds(timeSeconds);
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	return (
		<CountdownContain>
			<TimeArticle>
				<TimeValue>{days}D</TimeValue>
				{/* <TimeTitle>Days</TimeTitle> */}
			</TimeArticle>
			<TimeArticle>
				<TimeValue> </TimeValue>
			</TimeArticle>
			<TimeArticle>
				<TimeValue>{hours}H</TimeValue>
				{/* <TimeTitle>Hours</TimeTitle> */}
			</TimeArticle>
			<TimeArticle>
				<TimeValue> </TimeValue>
			</TimeArticle>
			<TimeArticle>
				<TimeValue>{minutes}M</TimeValue>
				{/* <TimeTitle>Minutes</TimeTitle> */}
			</TimeArticle>
			<TimeArticle>
				<TimeValue> </TimeValue>
			</TimeArticle>
			<TimeArticle>
				<TimeValue>{seconds}S</TimeValue>
			</TimeArticle>

			{/* <LeftText>Left</LeftText> */}

			{/* <FireIcon src="/fire.webp" alt="fire" /> */}
		</CountdownContain>
	);
}
