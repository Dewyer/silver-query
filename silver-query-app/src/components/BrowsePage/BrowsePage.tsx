import React from 'react';
import styles from "./BrowsePage.module.scss";
import { RouteComponentProps } from "react-router-dom";
import BrowseFilters from '../BrowseFilters';
import ProductList from '../ProductList';

export interface State
{

}

class BrowsePage extends React.Component<RouteComponentProps,State>
{
	constructor(props: RouteComponentProps)
	{
		super(props);

		this.state = {

		};
	}

	historyListenerStop:any;

	componentDidMount()
	{
		this.historyListenerStop = this.props.history.listen((a,b)=>{
			console.log(a);
			this.updateQueryParams();
		});

		this.updateQueryParams();
	}

	componentWillUnmount()
	{
		this.historyListenerStop();
	}

	updateQueryParams()
	{
		let url = new URLSearchParams(window.location.href);
		console.log(window.location.href);
	}

	render()
	{
		return (
			<div>
				<BrowseFilters />
				<ProductList />
			</div>
		);
	}
}

export default BrowsePage;
