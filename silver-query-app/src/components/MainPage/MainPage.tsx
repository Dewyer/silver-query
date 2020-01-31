import React from 'react';
import styles from "./MainPage.module.scss"

export interface Props
{

}

export interface State
{

}

class MainPage extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}


	render(){
		return (
			<div>
				<p>test</p>
				<button>Start crawl merry my ass</button>
			</div>
		);
	}
}

export default MainPage;
