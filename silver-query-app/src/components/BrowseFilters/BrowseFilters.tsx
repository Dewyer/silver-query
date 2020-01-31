import React from 'react';
import styles from "./BrowseFilters.module.scss"
import BackendService from '../../utils/api/BackendService';

export interface Props
{

}

export interface State
{

}

class BrowseFilters extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	async componentDidMount()
	{
		let cats = await BackendService.getCategories();
		console.log("all  categories :",cats);
	}

	render(){
		return (
			<div
				className={styles.container}
			>

			</div>
		);
	}
}

export default BrowseFilters;
