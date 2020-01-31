import React from 'react';
import styles from "./NavHeader.module.scss"
import NavList from '../NavList';
import SearchInput from '../SearchInput';

export interface Props
{

}

export interface State
{

}

class NavHeader extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {

		};
	}

	render()
	{
		return (
			<div className={styles.wrapper}>
				<div className={styles.container}>
					<div className={styles.leftPartContainer}>
						<img src={require("../../assets/sword.png")} />
						<span>SILVERLAND</span>
					</div>
					<SearchInput />
					<NavList />
					<div>
						Search, Fb etc..
					</div>
				</div>
				<div className={styles.infoContainer}>
					<span >
						<b style={{marginRight:"0.8rem"}}>1036 Budapest, Lajos u. 40.</b>
						<b>Telefon</b>: (06-1) 250-41-57
					</span>
					<span>
						<b>Nyitva:</b> H-P: 10:30-18:00 Sz: 10:30-13:00
					</span>
				</div>
			</div>
		);
	}
}

export default NavHeader;
