import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import register from './Auth';

function Login(props) {
	const [formParams, setFormParams] = useState({ email: '', password: '' })

	function handleChange(e) {
		const { name, value } = e.target;
		setFormParams((prev) => ({
			...prev,
			[name]: value
		}));
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (!formParams.email || !formParams.password) {
			return;
		}
		props.handleLogin({ email: formParams.email, password: formParams.password })
	}

	return (
		<div className="sign-up" onSubmit={handleSubmit}>
			<div className="sign-up__body">
				<h2 className="sign-up__title">Вход</h2>
				<form className="sign-up__form" noValidate >
					<label className="sign-up__label">
						<input className="sign-up__field" type="email"
							name="email" placeholder="Email" id="" required
							value={formParams.email}
							onChange={handleChange} />
						<span className="sign-up__field-error"></span>
					</label>
					<label className="sign-up__label">
						<input className="sign-up__field" type="password"
							name="password" placeholder="Пароль" id="" required
							value={formParams.password}
							onChange={handleChange}
							 />
						<span className="sign-up__field-error"></span>
					</label>
					<button type="submit"
						className="sign-up__button"
					>Войти</button>
				</form>
			</div>
		</div>)
}

export default Login