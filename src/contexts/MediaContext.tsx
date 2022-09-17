import React, { useState } from 'react';

interface MediaProps {
	currentMedia: null | string;
	handleSetCurentMedia: (url: string) => void;
}

export const MediaContext = React.createContext<MediaProps>({
	currentMedia: null,
	handleSetCurentMedia: () => {},
});

const MediaProvider: React.FC = ({ children }) => {
	// store the id of the current playing player
	const [currentMedia, setPlaying] = useState<string | null>(null);

	const handleSetCurentMedia = (url: string) => {
		setPlaying(url);
	};

	return (
		<MediaContext.Provider value={{ currentMedia, handleSetCurentMedia }}>
			{children}
		</MediaContext.Provider>
	);
};

export default MediaProvider;
