import React from 'react';
import styles from "./Background.module.scss"

export interface Props
{
	opacity?:number,
	color?:string,
	className?:string
}

export interface State
{

}

class Background extends React.Component<Props,State>
{
	defaultProps:Props=
	{
		opacity:1,
		color:"white"
	}

	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	render(){
		return (
			<div>
				<div
					style={{
						position:"absolute",
						left:0,
						top:0
					}}
					className={this.props.className}
				>
					{this.props.children}
				</div>
				<div
					style={{
						position:"relative",
						top:0,
						left:0,
						bottom:0,
						right:0,
						opacity:this.props.opacity,
						backgroundColor:this.props.color,
						width:"100%",
						height:"100%"
					}}
				>
				</div>
			</div>

		);
	}
}

export default Background;
