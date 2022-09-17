/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// styled
import { BoxImage, MediaWrapper } from './styled';
// models
import { NFT } from 'models';
// components
import ReactPlayer from 'react-player/lazy';
import LazyImageCustom from 'components/CustomUI/LazyImages/LazyImageCustom';
// utils
import { getFileType } from 'utils';

export interface ItemImageProps {
	item: NFT | null;
}

export default function ItemImage({ item }: ItemImageProps) {
	// useState
	const [type, setType] = useState<string>('');

	useEffect(() => {
		if (!item) return;
		setType(getFileType(item.itemMedia));
		const el = new Image();
		el.src = item.itemMedia;
		el.addEventListener(
			'onLoad',
			() => {
				console.log(el.naturalHeight);
			},
			{ passive: true }
		);
	}, [item]);

	return (
		<BoxImage>
			{item && type === 'mp3' && (
				<>
					<LazyImageCustom
						src={item.itemPreviewMedia}
						alt="item"
						type="progress"
						wrapperPosition="relative"
						imgStyle={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							maxHeight: '100%',
							maxWidth: '100%',
						}}
					/>

					{/* <MediaWrapper> */}
					<ReactPlayer
						url={item.itemMedia}
						className="react-player"
						muted={true}
						playing={true}
						loop={true}
						controls
						width="100%"
						height={50}
					/>
					{/* </MediaWrapper> */}
				</>
			)}
			{item && type === 'mp4' && (
				<MediaWrapper>
					<ReactPlayer
						url={item.itemMedia}
						className="react-player"
						muted={false}
						playing={false}
						loop={true}
						controls={true}
						volume={0.5}
						config={{ file: { attributes: { controlsList: 'nodownload' } } }}
						stopOnUnmount={true}
					/>
				</MediaWrapper>
			)}
			{type !== 'mp3' && type !== 'mp4' && (
				<LazyImageCustom
					src={item ? item.itemMedia : '/loadingNFT.gif'}
					alt="item"
					wrapperPosition="absolute"
					type="progress"
					imgStyle={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						maxHeight: '100%',
						maxWidth: '100%',
					}}
				/>
			)}
		</BoxImage>
	);
}
