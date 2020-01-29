import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from '../MainPage';

const App: React.FC = () =>
{
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={MainPage} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
