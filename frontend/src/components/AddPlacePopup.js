import React, { useRef, useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';


export default function AddPlacePopup({ isOpen, onClose, onCardAdd }) {
	const [name, setName] = useState();
	const [url, setUrl] = useState();

	function handleSubmit(e) {
		e.preventDefault();

		onCardAdd({
			name,
			link: url
		});
	}

	useEffect(() => {
		setName('');
		setUrl('');
  }, [isOpen]);


	function handleChangeName(e) {
		setName(e.target.value);
	}

	function handleChangeUrl(e) {
		setUrl(e.target.value)
	}

	return (
		<PopupWithForm onSubmit={handleSubmit} name='add-image' title='Новое место' isOpen={isOpen} onClose={onClose}>
			<label className="popup__label">
				<input onChange={handleChangeName} type="text" name="name" placeholder="Название" id="place-input"
					className="popup__field popup__name-card" minLength="2" maxLength="30" required value={name || ''} />
				<span className="popup__input-error place-input-error"></span>
			</label>
			<label className="popup__label">
				<input onChange={handleChangeUrl} type="url" name="link" placeholder="Ссылка на картинку" id="link-input"
					className="popup__field popup__link-card" required value={url || ''} />
				<span className="popup__input-error link-input-error"></span>
			</label>
		</PopupWithForm>
	)
}