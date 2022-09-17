import { MediaContext } from 'contexts/MediaContext';
import { useState, useEffect, useContext } from 'react';

export const useMedia = (url: string) => {
	const [media] = useState(new HTMLMediaElement());
	const [playing, setPlaying] = useState<boolean>(false);
	const { currentMedia, handleSetCurentMedia } = useContext(MediaContext);

	const toggle = () => {
		setPlaying(!playing);
		handleSetCurentMedia(url);
	};

	useEffect(() => {
		if (currentMedia === url) {
			playing ? media.play() : media.pause();
		} else {
			media.pause();
			setPlaying(false);
		}
		return () => media.pause();
	}, [media, playing, currentMedia, url]);

	useEffect(() => {
		if (!media) return;
		media.addEventListener('ended', () => setPlaying(false), { passive: true });
		return () => {
			media.removeEventListener('ended', () => setPlaying(false));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [playing, toggle] as const;
};
