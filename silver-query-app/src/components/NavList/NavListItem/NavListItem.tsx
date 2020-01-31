import React from 'react';
import styles from "./NavListItem.module.scss"
import { Link } from 'react-router-dom';

export interface NavListItemData
{
	title:string,
	to:string,
	current:boolean
}

export interface Props
{
	data:NavListItemData
}

export interface State
{

}

class NavListItem extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	render(){
		return (
			<Link to={this.props.data.to} className={styles.item}>
				{this.props.data.title}
			</Link>
		);
	}
}

export default NavListItem;
