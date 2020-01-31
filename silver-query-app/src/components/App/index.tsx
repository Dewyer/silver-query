import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from '../MainPage';
import ContentWrapper from '../ContentWrapper';
import BrowsePage from '../BrowsePage';

const App: React.FC = () =>
{
	return (
		<BrowserRouter>
			<ContentWrapper>
				<Switch>
					<Route exact path="/" component={MainPage} />
					<Route exact path="/browse" component={BrowsePage} />
				</Switch>
			</ContentWrapper>
		</BrowserRouter>
	);
}

export default App;
