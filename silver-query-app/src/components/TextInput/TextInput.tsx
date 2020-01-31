import React from 'react';
import styles from "./TextInput.module.scss"

export interface Props
{
	className?:string;
	style?:React.CSSProperties;
	placeHolder?:string,
	glyphComponent?:any
}

export interface State
{

}

class TextInput extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	render(){
		return (
			<span>
				<input
					style={this.props.style}
					className={`${this.props.className} ${styles.input}`}
					type="text"
					placeholder={this.props.placeHolder ? this.props.placeHolder : ""}
				/>
				<span
					style={{
						position:"relative",
						right:25,
						top:0
					}}
				>
					{this.props.glyphComponent}
				</span>
			</span>
		);
	}
}

export default TextInput;
