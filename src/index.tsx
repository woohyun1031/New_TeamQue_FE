import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/configStore';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './styles/GlobalStyle';

ReactDOM.render(
	<React.StrictMode>
		<GlobalStyle />
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);

