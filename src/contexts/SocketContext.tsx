import React, { useEffect, useState } from 'react';
//Socket
import { io, Socket } from 'socket.io-client';
// constants
import { API_ENDPOINT_SOCKET } from '../constants';

interface SocketProps {
	socket: Socket;
	socketAuth: Socket;
}

export const SocketContext = React.createContext<SocketProps>({} as SocketProps);

const SocketProvider: React.FC = ({ children }) => {
	// useState
	const [socket] = useState<Socket>(
		io(API_ENDPOINT_SOCKET, {
			transports: ['websocket'],
			autoConnect: false, // true
		})
	);

	const [socketAuth] = useState<Socket>(
		io(API_ENDPOINT_SOCKET, {
			transports: ['websocket'],
			autoConnect: false,
		})
	);

	// useEffect
	useEffect(() => {
		return () => {
			socket.removeAllListeners();
			socket.disconnect();
			socketAuth.removeAllListeners();
			socketAuth.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<SocketContext.Provider value={{ socket, socketAuth }}>{children}</SocketContext.Provider>
	);
};

export default SocketProvider;
