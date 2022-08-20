import React, { useContext, useEffect, useState } from 'react'
import pencil from '../images/edit-avatar.svg'
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {
	const currentUser = useContext(CurrentUserContext);

	return (
		<main>
			<section className="profile">
				<div className="profile__info">
					<div className="profile__edit-avatar" onClick={onEditAvatar}>
						<img className="profile__pencil" src={pencil} alt="Изменить" />
						<img className="profile__avatar" src={currentUser.avatar} alt="Аватар" />
					</div>
					<div>
						<div className="profile__name-and-edit">
							<h1 className="profile__name">{currentUser.name}</h1>
							<button type="button" className="profile__edit" onClick={onEditProfile}></button>
						</div>
						<p className="profile__sub-name">{currentUser.about}</p>
					</div>
				</div>
				<button type="button" className="profile__add-button" onClick={onAddPlace}></button>
			</section>

			<section className="elements">
				{cards.map(card => (
					<Card onCardLike={onCardLike} onCardDelete={onCardDelete} onCardClick={onCardClick} key={card._id} card={card} />
				))}
			</section>
		</main>
	)
}

export default Main;

