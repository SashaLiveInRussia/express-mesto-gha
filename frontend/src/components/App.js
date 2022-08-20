import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

import SignUp from './Register';
import SignIn from './Login';
import ProtectedRoute from './ProtectedRoute';
import * as Auth from './Auth';
import InfoTooltip from './InfoTooltip';

function App() {
	const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
	const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
	const [selectedCard, setSelectedCard] = useState(null);
	const [currentUser, setCurrentUser] = useState({});
	const [cards, setCards] = useState([]);

	const [userData, setUserData] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);
	const [isInfoTooltip, setIsInfoTooltip] = useState(false)
	const history = useHistory();

	const handleLogin = ({ email, password }) => {
		return Auth.authorize(email, password)
			.then((data) => {
				if (data.token) {
					localStorage.setItem('jwt', data.token);
					api.setHeaders({authorization: data.token});
					tokenCheck();
				}
			})
			.catch(console.error)
			.finally(() => {
				setIsInfoTooltip(true);
			})
	}

	const handleRegister = ({ email, password }) => {
		return Auth.register(email, password).then(() => {
			history.push('/sign-in')
				
		}).catch(console.error);
	}

	const tokenCheck = () => {
		if (localStorage.getItem('jwt')) {
			const jwt = localStorage.getItem('jwt');
			return Auth.getContent(jwt).then((res) => {
				if (res) {
					const userData = {
						email: res.email
					}

					setUserData(userData);
					return userData;
				}
			}).catch(console.error);
		}

		return Promise.resolve({});
	}

	const closeInfoPopup = () => {
		if (userData.email) {
			setLoggedIn(true);
		}
		closeAllPopups();
	}

	const signOut = () => {
		localStorage.removeItem('jwt');
		setLoggedIn(false);
		setUserData({});
		history.push('/sign-in');
	}

	useEffect(() => {
		tokenCheck().then((userData) => {
			if (userData.email) {
				setLoggedIn(true);
			}
		}).catch(console.error)
	}, []);

	useEffect(() => {
		if (loggedIn) {
			history.push('/');
		}
	}, [loggedIn]);

	useEffect(() => {
		api.getInitialCards()
			.then((data) => {
				setCards(data);
			})
			.catch(console.error);
	}, []);

	useEffect(() => {
		api.getUserInfo()
			.then(userInfo => {
				setCurrentUser(userInfo)
			})
			.catch(console.error);
	}, []);

	function closeAllPopups() {
		setIsEditProfilePopupOpen(false)
		setIsAddPlacePopupOpen(false)
		setIsEditAvatarPopupOpen(false)
		setSelectedCard(null)
		setIsInfoTooltip(null)
	};

	function handleEditProfileClick() {
		setIsEditProfilePopupOpen(true)
	};

	function handleEditAvatarClick() {
		setIsEditAvatarPopupOpen(true)
	};

	function handleAddPlaceClick() {
		setIsAddPlacePopupOpen(true)
	};

	function handleCardClick(card) {
		setSelectedCard(card);
	}

	function handleUpdateUser(user) {
		api.editProfile(user)
			.then(userInfo => {
				setCurrentUser(userInfo.data);
				closeAllPopups();
			})
			.catch(console.error);
	}

	function handleUpdateAvatar(userAvatar) {
		api.changeAvatar(userAvatar)
			.then(userInfo => {
				setCurrentUser(userInfo.data);
				closeAllPopups();
			})
			.catch(console.error);
	}

	function handleCardLike(card) {
		// Снова проверяем, есть ли уже лайк на этой карточке
		const isLiked = card.likes.some(i => i === currentUser._id);

		// Отправляем запрос в API и получаем обновлённые данные карточки
		api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
			setCards((state) => state.map((c) => c._id === card._id ? newCard.data : c));
		}).catch(console.error);
	}

	function handleCardDelete(cardId) {
		api.deleteCard(cardId)
			.then(() => {
				setCards([...cards.filter(c => c._id !== cardId)]);
				closeAllPopups();
			})
			.catch(console.error);
	}

	function handleAddPlaceSubmit(card) {
		api.addCard(card)
			.then(newCard => {
				setCards([newCard.data, ...cards]);
				closeAllPopups();
			})
			.catch(console.error)
	}

	return (
		<CurrentUserContext.Provider value={currentUser}>
			<div className="body">
				<Switch>
					<ProtectedRoute exact path="/" loggedIn={loggedIn}>
						<Header email={userData.email} title='Выйти' link={signOut} />
						<div className="page">
							<Main
								cards={cards}
								onCardLike={handleCardLike}
								onCardDelete={handleCardDelete}
								onCardClick={handleCardClick}
								onEditProfile={handleEditProfileClick}
								onAddPlace={handleAddPlaceClick}
								onEditAvatar={handleEditAvatarClick}
							/>
							<Footer />
							<EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
							<EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
							<AddPlacePopup onCardAdd={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />
							<PopupWithForm name='_id' title='Вы уверены?' onClose={closeAllPopups}>
								<input type="hidden" name="_id" className="popup__field" />
								<button type="submit" className="popup__button-save popup__button-yes">Да</button>
							</PopupWithForm>
							<PopupWithForm name='profil' title='Alex' isOpen={false} onClose={closeAllPopups}>
								<label className="popup__label">
									<input type="url" name="avatar" placeholder="Ссылка" id="avatar-input" className="popup__field" required />
									<span className="popup__input-error avatar-input-error"></span>
								</label>
							</PopupWithForm>
							<ImagePopup card={selectedCard} onClose={closeAllPopups} />
						</div>
					</ProtectedRoute>

					<Route path="/sign-in">
						<Header title="Регистрация" link="/sign-up" />
						<div className="page">
							<SignIn handleLogin={handleLogin} tokenCheck={tokenCheck} />
							<InfoTooltip isOk={userData.email} isOpen={isInfoTooltip} onClose={closeInfoPopup} />
						</div>
					</Route>

					<Route path="/sign-up">
						<Header title="Вход" link="/sign-in" />
						<div className="page">
							<SignUp handleRegister={handleRegister} />

						</div>
					</Route>

					<Route>
						{loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up" />}
					</Route>
				</Switch>


			</div>
		</ CurrentUserContext.Provider >
	);
}

export default App;
