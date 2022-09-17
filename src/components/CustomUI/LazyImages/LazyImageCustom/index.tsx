/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CircularProgress, {
	circularProgressClasses,
	CircularProgressProps,
} from '@mui/material/CircularProgress';
import LazyLoadImg from 'components/CustomUI/LazyLoadImg';
import { CustomImg } from './styled';

export interface ILazyImageCustomProps {
	src: string;
	alt: string;
	wrapperPosition: 'absolute' | 'relative'; // In case that 'parent height' is depend on padding (ex: paddingTop: 100%;), we should use 'absolute' (parent also must have property 'position'). Else we use 'relative'.
	imgStyle?: object;
	type: 'skeleton' | 'progress';
	errorComponent?: React.ReactElement;
	refresh?: boolean;
	innerRef?: any;
}

export default function LazyImageCustom({
	src,
	alt,
	wrapperPosition,
	imgStyle,
	type,
	errorComponent,
	refresh = false,
	innerRef,
}: ILazyImageCustomProps) {
	// useState
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	// const [imgSrc, setImgSrc] = useState<string>(src);
	const [refreshImg, setRefreshImg] = useState<boolean>(false);

	const handleOnLoad = () => {
		setTimeout(() => {
			setIsLoaded(true);
		}, 500);
	};

	const handleOnError = () => {
		setIsError(true);
		// setImgSrc(placeHolder);
	};

	function CustomCircularProgress(props: CircularProgressProps) {
		return (
			<Box sx={{ position: 'relative' }}>
				<CircularProgress
					variant="determinate"
					sx={{
						color: (theme) =>
							theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
					}}
					size={40}
					thickness={4}
					{...props}
					value={100}
				/>
				<CircularProgress
					variant="indeterminate"
					disableShrink
					sx={{
						color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
						animationDuration: '550ms',
						position: 'absolute',
						left: 0,
						[`& .${circularProgressClasses.circle}`]: {
							strokeLinecap: 'round',
						},
					}}
					size={40}
					thickness={4}
					{...props}
				/>
				{/* <LazyLoadImg /> */}
			</Box>
		);
	}

	useEffect(() => {
		setRefreshImg(!refreshImg);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);
	//type === 'skeleton'
	return (
		<Box
			ref={innerRef}
			sx={{ position: wrapperPosition, top: 0, left: 0, width: '100%', height: '100%' }}
		>
			<img
				loading="lazy"
				style={{ ...imgStyle, opacity: isLoaded ? 1 : 0 }}
				src={src}
				alt={alt}
				onLoad={handleOnLoad}
				onError={handleOnError}
			/>

			{!isLoaded && !isError && (
				<>
					{type === 'skeleton' ? (
						<Skeleton
							variant="rectangular"
							sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
							}}
						/>
					) : (
						<Box
							sx={{
								// margin: 'auto',
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								// width: '100%',
								// height: '100%',
							}}
						>
							{/* <LazyLoadImg /> */}
							<CustomCircularProgress />
							{/* <Box sx={{}}>
								<CustomImg loading="lazy" src={src} alt={alt} />
							</Box> */}
						</Box>
					)}
				</>
			)}

			{/* Error Component */}
			{isError && errorComponent}
		</Box>
	);
}
