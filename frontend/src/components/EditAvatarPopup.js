import React, { useRef } from 'react';
import PopupWithForm from './PopupWithForm';


export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
	const inputFile = useRef();

	function handleSubmit(e) {
		e.preventDefault();

		onUpdateAvatar({
			avatar: inputFile.current.value
		});
	}


	return (
		<PopupWithForm onSubmit={handleSubmit} name='add-image' title='Обновить аватар' isOpen={isOpen} onClose={onClose}>
			<label className="popup__label">
				<input ref={inputFile} type="url" name="avatar" placeholder="Ссылка" id="avatar-input" className="popup__field" required />
				<span className="popup__input-error avatar-input-error"></span>
			</label>
		</PopupWithForm>
	)
}