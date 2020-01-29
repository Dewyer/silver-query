import React from 'react';
import styles from "./MainPage.module.scss"
import CrawlerService from '../../utils/CrawlerService';

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
		this.onStartCrawl = this.onStartCrawl.bind(this);

		this.state = {

		};
	}

	async onStartCrawl()
	{
		console.log("started to crawl");
		await CrawlerService.doCrawl();
	}

	render(){
		return (
			<div>
				<p>test</p>
				<button onClick={this.onStartCrawl}>Start crawl</button>
			</div>
		);
	}
}

export default MainPage;
