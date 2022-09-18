import {useState, useEffect} from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup.js";
import {api} from "../utils/Api";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const getCardsInfo = async () =>{
        try{
            const res = await api.getCards();
            setCards(res);
        }
        catch (err) {
            console.log(err)
        }
  }

  useEffect(()=>{
        getCardsInfo()
  }, [])

  const handleCardLike = async (card) => {
      try {
          const isLiked = card.likes.some(i => i._id === currentUser._id);
          const newCard = await api.changeLikeCardStatus(card._id, isLiked)
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      }
      catch (err) {
          console.log(err)
      }
  }

  const handleCardDelete = async (card) => {
      try {
          await api.deleteCard(card._id)
          setCards((state) => state.filter((c) => c._id !== card._id));
      }
      catch (err) {
          console.log(err)
      }
  }

  const getFullUserInfo = async () =>{
        try{
            const info = await api.getUserInfo();
            setCurrentUser(info);
        }
        catch (err) {
            console.log(err)
        }
  }

  useEffect(()=>{
      getFullUserInfo();
  }, [])

  const closeAllPopups = () => {
      setIsEditProfilePopupOpen(false);
      setIsAddPlacePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsImageOpen(false);
  }

  const handleEditAvatarClick = () => {
      setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
      setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
      setIsAddPlacePopupOpen(true);
  }

  const handleCardClick = (card) => {
      setSelectedCard(card);
      setIsImageOpen(true);
  }

  const handleAddPlaceSubmit = async (data) => {
        try {
            const newCard = await api.postCard(data);
            setCards([newCard, ...cards]);
            closeAllPopups();
        }
        catch (err) {
            console.log(err)
        }
  }

  const handleUpdateUser = async (data) =>{
        try {
            const info = await api.changeUserInfo(data);
            setCurrentUser(info);
            closeAllPopups();
        }
        catch (err) {
            console.log(err)
        }
  }

  const handleUpdateAvatar = async (data) =>{
        try {
            const avatar = await api.changeUserAvatar(data);
            setCurrentUser(avatar);
            closeAllPopups();
        }
        catch (err) {
            console.log(err)
        }
  }

  return (
      <CurrentUserContext.Provider value={currentUser}>
          <div className="page">
            <Header/>
            <Main
                onAddPlace={handleAddPlaceClick}
                onEditProfile={handleEditProfileClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                handleCardLike={handleCardLike}
                handleCardDelete={handleCardDelete}/>
            <Login/>
            <Footer/>
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              isClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}>
            </AddPlacePopup>
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                isClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}>
            </EditProfilePopup>
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                isClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}>
            </EditAvatarPopup>
            <PopupWithForm
                name='agree'
                ariaLabel='подтверждением'
                title='Вы уверены?'
                button='Да'/>
            <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups}
                isOpen={isImageOpen}/>
          </div>
      </CurrentUserContext.Provider>
  );
}

export default App;
