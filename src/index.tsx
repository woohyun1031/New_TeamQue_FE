import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/configStore';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<GlobalStyle />
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<ThemeProvider theme={theme}>
						<App />
					</ThemeProvider>
				</BrowserRouter>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

