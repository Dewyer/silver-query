import React from 'react';
import styles from "./NavFooter.module.scss"

export interface Props
{

}

export interface State
{

}

class NavFooter extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	render(){
		return (
			<footer className={styles.container}>
				© 2018 Silverland
			</footer>
		);
	}
}

export default NavFooter;
