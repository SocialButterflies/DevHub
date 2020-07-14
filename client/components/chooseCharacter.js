import React, {useState} from 'react'
import {connect} from 'react-redux'
import {createPlayerThunk} from '../store/preGame'
import {Redirect} from 'react-router-dom'

const chooseCharacter = props => {
  // React hooks! Gimme local state:
  const [startupName, setStartupName] = useState('')
  const [img, setImg] = useState('')
  const [redirectNow, setRedirectNow] = useState(false)
  const [redirectHome, setRedirectHome] = useState(false)

  const handleSubmit = () => {
    if (props.reduxGame.host === null) {
      props.createPlayer(props.reduxGame.gameCode, startupName, img, true)
      setRedirectNow(true)
    } else {
      // create a player to join a game
      //has the game already started
      console.log('I AM NOT A HOST')
      if (
        props.reduxGame.isStarted === true ||
        props.reduxGame.playersArray.length === 4
      ) {
        console.log(props.reduxGame.isStarted, 'REDUXGAME')
        console.log(props.reduxGame.playersArray.length, 'ARRAY LENGTH')
        console.log('THE IF BLOCK RAN')
        const message = props.reduxGame.isStarted
          ? 'Game already started.Go join another game '
          : 'Game is full. We are sending you back home, so join another game.'
        alert(message)
        setRedirectHome(true)
      } else {
        console.log('I CREATED A PLAYER, REDIRECT ME!!!!')
        //first check is there room in the game for me
        props.createPlayer(props.reduxGame.gameCode, startupName, img, false)
        setRedirectNow(true)
      }
    }
  }

  const handleImg = event => {
    // event.target.src is a giant link... maybe we just want to handle the alt text
    // console.log('event.target.alt:', event.target.alt)
    setImg(event.target.src)
    const chars = document.getElementsByClassName('responsive-img')
    for (let i = 0; i < chars.length; i++) {
      if (chars[i].id !== event.target.id) {
        chars[i].classList.remove('selectedChar')
        chars[i].classList.add('unselectedChar')
      } else chars[i].classList.remove('unselectedChar')
    }
    event.target.classList.add('selectedChar')
  }

  if (props.reduxGame.gameCode === null) {
    alert('Invalid Game Code')
    return <Redirect to="/" />
  }
  if (redirectNow) {
    if (props.reduxGame.host === null) {
      return <Redirect to="/create/lobby" />
    }
    return <Redirect to="/join/lobby" />
  }
  if (redirectHome) {
    return <Redirect to="/" />
  }
  return (
    <div className="welcome">
      <div id="title">
        <h1>[Code]opoly</h1>
      </div>
      <div id="inputNameBox">
        <div id="inputLabel">Name your startup:</div>
        <input
          type="text"
          value={startupName}
          placeholder="insert supercool name here"
          onChange={() => {
            setStartupName(event.target.value)
          }} //Will this work?
        />
      </div>
      <div id="characterBox">
        <div id="firstRow">
          <img
            className="responsive-img"
            id="doge"
            alt="Doge"
            onClick={handleImg}
            // src="data:image/jpeg;base64,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"
            src="https://www.pngmart.com/files/11/Doge-Meme-PNG-Photos.png"
          />
          <img
            className="responsive-img"
            id="cody"
            alt="Cody"
            onClick={handleImg}
            // src="data:image/jpeg;base64,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"
            src="https://img2.pngio.com/pug-head-transparent-png-clipart-free-download-ywd-pug-head-png-1260_900.png"
          />
          <img
            className="responsive-img"
            id="cat"
            alt="Cat"
            onClick={handleImg}
            // src="data:image/jpeg;base64,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"
            src="https://ya-webdesign.com/images250_/cat-face-png-2.png"
          />
        </div>
        <div id="secondRow">
          <img
            className="responsive-img"
            id="successKid"
            alt="Success Kid"
            onClick={handleImg}
            // src="https://pbs.twimg.com/profile_images/616284953781882880/wfINzp_W_400x400.jpg"
            src="https://i.ya-webdesign.com/images/baby-success-meme-png-2.png"
          />
          <img
            className="responsive-img"
            id="kermit"
            alt="Kermit"
            onClick={handleImg}
            // src="data:image/jpeg;base64,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"
            src="https://i.ya-webdesign.com/images/kermit-the-frog-png-8.png"
          />
          <img
            className="responsive-img"
            id="marshall"
            alt="Marshall"
            onClick={handleImg}
            src="https://vignette.wikia.nocookie.net/animalcrossing/images/8/80/Marshal_HHD.png/revision/latest?cb=20161013032212"
          />
        </div>
      </div>
      <div id="submitBtnBox">
        {props.reduxGame.host === null ? ( // Conditionally render the submit button
          <button
            type="button"
            disabled={img === '' || startupName === ''}
            onClick={handleSubmit}
          >
            CREATE GAME
          </button>
        ) : (
          <button
            type="button"
            disabled={img === '' || startupName === ''}
            onClick={handleSubmit}
          >
            JOIN GAME
          </button>
        )}
      </div>
    </div>
  )
}

const mapState = state => {
  return {
    reduxGame: state.preGame
  }
}

const mapDispatch = dispatch => {
  return {
    createPlayer(gameCode, startupName, img, isHost) {
      dispatch(createPlayerThunk(gameCode, startupName, img, isHost))
    }
  }
}

export default connect(mapState, mapDispatch)(chooseCharacter)
