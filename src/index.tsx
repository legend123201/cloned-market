import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
// import { BrowserRouter } from 'react-router-dom';
// redux
import { store } from './redux/store';
import { Provider } from 'react-redux';
// styled
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import 'swiper/swiper.min.css';
// components
import App from './App';
// service worker
import * as serviceWorker from './serviceWorker';
// context
import { SettingsProvider } from 'contexts/SettingsContext';
// theme
import ThemeConfig from 'theme';

// window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
// 	alert('Error occurred: ' + errorMsg + '/' + url + '/' + lineNumber); //or any message
// 	return false;
// };

// window.addEventListener('error', function (e) {
// 	alert('Error occurred: ' + e.error.message);
// 	return false;
// });

// window.addEventListener('unhandledrejection', function (e) {
// 	alert('Error occurred: ' + e.reason.message);
// });

ReactDOM.render(
	<Provider store={store}>
		<SettingsProvider>
			<ThemeConfig>
				<App />
			</ThemeConfig>
		</SettingsProvider>

		<ToastContainer position="top-right" />
	</Provider>,
	document.getElementById('root')
);
serviceWorker.register();
