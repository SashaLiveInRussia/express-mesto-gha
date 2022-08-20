import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
	const currentUser = useContext(CurrentUserContext);
	const isOwn = card.owner._id === currentUser._id;
	const cardDeleteButtonClassName = `element__delete ${isOwn ? 'element__delete_visible' : 'element__delete_hidden'}`;
	const isLiked = card.likes.some(i => i._id === currentUser._id);
	const cardLikeButtonClassName = `element__like ${isLiked ? 'element__like_active' : ''}`;

	function handleClick() {
		onCardClick(card);
	}

	function handleLikeClick() {
		onCardLike(card)
	}


	function handleDeleteClick() {
		onCardDelete(card._id)
	}

	return (
		<div className="element">
			<div className={cardDeleteButtonClassName} onClick={handleDeleteClick}></div>
			<img className="element__img" src={card.link} alt={card.name} onClick={handleClick} />
			<div className="element__info">
				<h2 className="element__title">{card.name}</h2>
				<div className="element__likes">
					<button type="button" onClick={handleLikeClick} className={cardLikeButtonClassName}></button>
					<span type="number" className="element__like-number">{card.likes.length}</span>
				</div>
			</div>
		</div>
	)
}

export default Card