import React from 'react';
import styles from "./BrowsePage.module.scss"

export interface Props
{

}

export interface State
{

}

class BrowsePage extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	render(){
		return (
			<p>Look at my wares.</p>
		);
	}
}

export default BrowsePage;
