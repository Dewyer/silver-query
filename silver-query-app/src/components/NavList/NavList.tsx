import React from 'react';
import styles from "./NavList.module.scss"
import NavListItem, { NavListItemData } from './NavListItem/NavListItem';

export interface Props
{

}

export interface State
{

}

class NavList extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	render()
	{
		const options: NavListItemData[ ] =[
			{to:"/browse",title:"WEBSHOP",current:false},
			{ to: "/", title: "AKTUÁLIS", current: false },
			{ to: "#", title: "KAPCSOLAT", current: false },
		];
		return (
			<div className={styles.container} >
				{options.map(opt=><NavListItem data={opt} key={opt.to}/>)}
			</div>
		);
	}
}

export default NavList;
