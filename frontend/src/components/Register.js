import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';
import * as Auth from './Auth';

function Register(props) {
	const [formParams, setFormParams] = useState({ email: '', password: '' });

	function handleChange(e) {
		const { name, value } = e.target;
		setFormParams((prev) => ({
			...prev,
			[name]: value
		}));
	}

	function handleSubmit(e) {
		e.preventDefault();
		const { email, password } = formParams;
		console.log(password)
		props.handleRegister({ email, password }).catch(err => {
			console.log(err)
		})
	}

	return (
		<div className="sign-up" >
			<div className="sign-up__body">
				<h2 className="sign-up__title">Регистрация</h2>
				<form onSubmit={handleSubmit} className="sign-up__form" noValidate >
					<label className="sign-up__label">
						<input className="sign-up__field" type="email" name="email" placeholder="Email"
							id="" required
							onChange={handleChange}
							value={formParams.email}
							/>
						<span className="sign-up__field-error"></span>
					</label>
					<label className="sign-up__label">
						<input className="sign-up__field" type="password"
							name="password" placeholder="Пароль" id="" required
							onChange={handleChange} 
							value={formParams.password} />
						<span className="sign-up__field-error"></span>
					</label>
					<button type="submit" className="sign-up__button">Зарегистрироваться</button>
					<Link to="./sign-in" className="sign-up__link">Уже зарегистрированы? Войти</Link>
				</form>
			</div>
		</div>)
}

export default Register;