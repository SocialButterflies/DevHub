/* eslint-disable max-statements */
import React, {useState, useEffect} from 'react'
import {connect, useSelector, useDispatch} from 'react-redux'
import {GameBoard, GameViewTitle, Player} from './index'
import {Redirect} from 'react-router-dom'
import {useFirestoreConnect} from 'react-redux-firebase'
import {EventEmitter} from 'events'
import ChallengeModal from './challengeModal'
import {phaserE} from './scene'
import {modalE} from './challenge'
import {getChallengeThunk} from '../store/challenge'
import WinModal from './winModal'

export const newGame = new EventEmitter()

let counter = 0
// Although Firestore updates whenever the gameDoc changes, the useSelector variables do not refresh...
// so we set these deck variables in a useEffect hook that runs whenever gameDoc changes.
let deckFrontend
let deckBackend
let deckUI
let deckAlgorithm
let deckMisc
let deckInterview
let areDecksAssigned = false
// let showModal = false

// eslint-disable-next-line max-statements
// eslint-disable-next-line complexity
const PlayerPanels = () => {
  // const [counter, setCounter] = useState(0)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [showWinModal, setShowWinModal] = useState(false)
  const [winnerName, setWinnerName] = useState('')
  const dispatch = useDispatch()
  // const [showTurn, setShowTurn] = useState(false)

  const gamesCollectionObj = useSelector(state => state.firestore.data.games) // Hook into redux store
  if (gamesCollectionObj === undefined) {
    return <Redirect to="/rejoin" />
  }
  const gameCode = Object.keys(gamesCollectionObj)[0]
  const gameDoc = useSelector(state => state.firestore.data.games[gameCode])
  const playerIdArray = useSelector(
    state => state.firestore.data.games[gameCode].playersArray
  )

  const [ready, setReady] = useState(false)
  const arrayOfPlayerPathsAndGame = playerIdArray.map(playerId => {
    return {
      collection: 'players',
      doc: playerId
    }
  })

  arrayOfPlayerPathsAndGame.push({
    collection: 'games',
    doc: gameCode
  })

  const players = useSelector(state => state.firestore.data.players)

  // Get currentPlayer name:
  let currentPlayerId
  let currentPlayerName
  if (
    gamesCollectionObj !== undefined &&
    gameCode !== undefined &&
    players !== undefined
  ) {
    currentPlayerId = gamesCollectionObj[gameCode].currentPlayer
    currentPlayerName = players[currentPlayerId].startupName
  }

  phaserE.setMaxListeners(1)

  if (counter < 1) {
    phaserE.on('playerLanded', (tileType, category = null, cardName = null) => {
      // setCounter(1)
      if (tileType === 'challenge' && areDecksAssigned) {
        let cardId
        switch (category) {
          case 'Frontend':
            cardId = deckFrontend[0]
            break
          case 'Backend':
            cardId = deckBackend[0]
            break
          case 'UI':
            cardId = deckUI[0]
            break
          case 'Algorithm':
            cardId = deckAlgorithm[0]
            break
          case 'Misc':
            cardId = deckMisc[0]
            break
          case 'Interview':
            cardId = deckInterview[0]
            break
          default:
            cardId = null
            break
        }

        // let readOnlyDeckArr = gameDoc[deckName] // should be an array of cards still avaiable to draw for that category
        // // let copyOfDeck = [...readOnlyDeckArr]
        // console.log('this is what readOnlyDeckArr looks like BEFORE shifting', readOnlyDeckArr)
        // console.log("what does gameDoc look like?", gameDoc)
        // let cardId = readOnlyDeckArr[0]
        console.log('cardId', cardId)
        dispatch(getChallengeThunk(cardId))
        setShowChallengeModal(true)
        counter = 1
        // console.log("AFTER shifting", copyOfDeck)
      }
    })
  }
  // Now handle the closing of the modal!
  modalE.setMaxListeners(4)
  modalE.on('modalGoAway', () => {
    setShowChallengeModal(false)
  })

  phaserE.on('playerPassedGo', () => {
    if (players !== undefined && gamesCollectionObj !== undefined) {
      let meetsWinConditions = false
      let decks = [
        'hasFrontend',
        'hasBackend',
        'hasUI',
        'hasAlgorithm',
        'hasMisc'
      ]
      if (players[currentPlayerId].seedMoney > 10000) {
        for (let i = 0; i < decks.length; i++) {
          if (players[currentPlayerId][decks[i]] === 'none') break
          if (i === decks.length - 1) {
            meetsWinConditions = true
          }
        }
      }
      if (meetsWinConditions) {
        setWinnerName(players[currentPlayerId].startupName)
        setShowWinModal(true)
      }
    }
  })

  const triggerEmit = () => {
    let characters = {
      'https://www.pngmart.com/files/11/Doge-Meme-PNG-Photos.png': 'doge',
      'https://img2.pngio.com/pug-head-transparent-png-clipart-free-download-ywd-pug-head-png-1260_900.png':
        'cody',
      'https://ya-webdesign.com/images250_/cat-face-png-2.png': 'cat',
      'https://i.ya-webdesign.com/images/baby-success-meme-png-2.png': 'kid',
      'https://i.ya-webdesign.com/images/kermit-the-frog-png-8.png': 'kermit',
      'https://vignette.wikia.nocookie.net/animalcrossing/images/8/80/Marshal_HHD.png/revision/latest?cb=20161013032212':
        'marshall'
    }
    let playerDocs = Object.values(players)

    const imageNameArray = playerDocs.map(player => {
      return characters[player.image]
    })
    const hostStatusArray = playerDocs.map(player => {
      return player.isHost
    })

    newGame.emit('start', imageNameArray, hostStatusArray)

    document.getElementById('placeChars').classList.add('gameStarted')
    const title = document.getElementById('gameViewTitle')
    title.classList.remove('gameStarted')
  }

  useFirestoreConnect(arrayOfPlayerPathsAndGame)

  useEffect(
    () => {
      if (players) {
        if (playerIdArray.length === Object.values(players).length) {
          setReady(true)
        }
      }
    },
    [playerIdArray, players]
  )

  useEffect(
    () => {
      console.log('gameDoc changed!', gameDoc)
      areDecksAssigned = true
      deckFrontend = gameDoc.deckFrontend
      deckBackend = gameDoc.deckBackend
      deckUI = gameDoc.deckUI
      deckMisc = gameDoc.deckMisc
      deckInterview = gameDoc.deckInterview
    },
    [gameDoc]
  )

  // Our redux state now has:
  // state.firestore.data.games[gameCode] for the game document
  // AND
  // state.firestore.data.players[playerId] for each player document
  let centerPanel
  if (ready) {
    centerPanel = (
      <div id="gameView">
        <div id="gameViewTitle" className="gameStarted">
          <GameViewTitle currentPlayerName={currentPlayerName} />
        </div>
        <button id="placeChars" type="button" onClick={triggerEmit}>
          Place players to begin game!
        </button>
        <div id="panelsBox">
          <div className="leftside">
            <div id="player1" className="singlePlayerBox">
              <Player player={Object.values(players)[0]} />
            </div>
            {Object.values(players).length > 2 ? (
              <div id="player3" className="singlePlayerBox">
                <Player player={Object.values(players)[2]} />
              </div>
            ) : (
              <div />
            )}
          </div>
          <div id="theGameBox">
            <ChallengeModal show={showChallengeModal} />
            <WinModal show={showWinModal} name={winnerName} />
          </div>
          <div className="rightside">
            <div id="player2" className="singlePlayerBox">
              <Player player={Object.values(players)[1]} />
            </div>

            {Object.values(players).length > 3 ? (
              <div id="player4" className="singlePlayerBox">
                <Player player={Object.values(players)[3]} />
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    )
  }
  if (!players) {
    return null
  }
  return <div id="mainScreen">{centerPanel}</div>
}

export default PlayerPanels
