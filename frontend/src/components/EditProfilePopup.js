import React, { useContext, useEffect, useState } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm'

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
	const currentUser = useContext(CurrentUserContext);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	function handleChangeName(e) {
		setName(e.target.value);
	}

	function handleChangeDescription(e) {
		setDescription(e.target.value)
	}

	function handleSubmit(e) {
		e.preventDefault();
		onUpdateUser({
			name,
			about: description,
		});
	}

	useEffect(() => {
		setName(currentUser.name);
		setDescription(currentUser.about);
	}, [currentUser, isOpen]);

	return (
		<PopupWithForm onSubmit={handleSubmit} name='profil' title='Редактировать профиль' isOpen={isOpen} onClose={onClose}>
			<label className="popup__label">
				<input type="text" name="name" placeholder="Имя" id="name-input" className="popup__field" minLength="2"
					maxLength="40" required value={name || ""} onChange={handleChangeName} />
				<span className="popup__input-error name-input-error"></span>
			</label>
			<label className="popup__label">
				<input type="text" name="about" placeholder="Профессия" id="profession-input" className="popup__field"
					minLength="2" maxLength="200" value={description || ""} required onChange={handleChangeDescription} />
				<span className="popup__input-error profession-input-error"></span>
			</label>
		</PopupWithForm>
	)
}

export default EditProfilePopup