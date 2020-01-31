import React from 'react';
import styles from "./ContentWrapper.module.scss"
import NavHeader from '../NavHeader';
import NavFooter from '../NavFooter';
import Background from '../Background';

export interface Props
{

}

export interface State
{

}

class ContentWrapper extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	render(){
		return (
			<div className={styles.container}>
				<NavHeader/>
				<div className={styles.contentWrapper}>
					{this.props.children}
				</div>
				<NavFooter/>
			</div>
		);
	}
}

export default ContentWrapper;
