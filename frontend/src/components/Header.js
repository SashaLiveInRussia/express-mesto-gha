import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/Vector.svg';

function Header({ title, link, email }) {
	const [widthWindow, setWidthWindow] = useState(document.documentElement.clientWidth);
	const [menuOpen, setMenuOpen] = useState(false);

	function handleMenuClick() {
		setMenuOpen(menu => !menu);
		var panel = document.querySelector('.header__block-login');
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
		} else {
			panel.style.maxHeight = panel.scrollHeight + "px";
		}
	}

	return (
		<>
			<div className={`header__block-login ${menuOpen ? 'header__block-login_active' : ''}`}>
				<div className='header__login'>{email}</div>
				<div className='header__login' >{title}</div>
			</div>

			<header className="header">
				<div>
					<img className="logo" src={logo} alt="Логотип" />
				</div>
				
				{email ? (
					<div onClick={handleMenuClick} className={`header__user ${setWidthWindow ? 'header__icon' : ''}  ${menuOpen ? 'header__panel-close' : ''}`} >
						<div className={`${setWidthWindow ? 'header__login_hide' : 'header__login'}`}>{email}</div>
						<div className={`${setWidthWindow ? 'header__login_hide' : 'header__login'}`} onClick={link}>{title}</div>
					</div>
				) : (
					<Link to={link} className='header__user'>{title}</Link>
				)}
			</header>
		</>
	)
}

export default Header

