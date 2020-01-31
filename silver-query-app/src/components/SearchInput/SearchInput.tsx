import React from 'react';
import styles from "./SearchInput.module.scss"
import TextInput from '../TextInput';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons'
export interface Props
{

}

export interface State
{

}

class SearchInput extends React.Component<Props,State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {

		};
	}

	render(){
		return (
			<TextInput
				className={styles.search}
				placeHolder="Keresés.."
				glyphComponent={<FontAwesomeIcon icon={faSearch} />}
			/>
		);
	}
}

export default SearchInput;
