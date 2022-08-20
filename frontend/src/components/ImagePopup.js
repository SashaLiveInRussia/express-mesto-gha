function ImagePopup({ card, onClose }) {
	return (
		<div className={`popup popup_image-view ${card ? 'popup_opened' : ''}`}>
			<div className="popup__image-container">
				<img className="popup__image" src={card?.link} alt={card?.name} />
				<h2 className="popup__image-title">{card?.name}</h2>
				<button type="button" className="popup__close-popup" onClick={onClose}></button>
			</div>
		</div>
	)
}

export default ImagePopup