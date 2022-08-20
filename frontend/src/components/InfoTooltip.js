import React, { useEffect, useState } from 'react';
import regErr from '../images/regErr.svg';
import regOk from '../images/regOk.svg';

function InfoTooltip({ onClose, isOpen, isOk }) {
	return (
		<div className={`popup popup_reg ${isOpen ? 'popup_opened' : ''}`} onClose={onClose}>
			<div className="popup__body popup__body-reg">
				<button type="button" className="popup__close-popup" onClick={onClose}></button>
				<div className='popup__reg-img'>
					<img src={isOk ? regOk : regErr} />
				</div>
				<h2 className='popup__reg-title'>
					{isOk ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
				</h2>
			</div>
		</div>
	)
};

export default InfoTooltip