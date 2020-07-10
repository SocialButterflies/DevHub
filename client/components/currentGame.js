import React, {useState, useEffect} from 'react'
import {connect, useSelector, useDispatch} from 'react-redux'
import {GameBoard, GameViewTitle, Player} from './index'
import {Redirect} from 'react-router-dom'
import {useFirestoreConnect} from 'react-redux-firebase'

const CurrentGame = () => {
  const gamesCollectionObj = useSelector(state => state.firestore.data.games) // Hook into redux store
  const gameCode = Object.keys(gamesCollectionObj)[0]
  const playersArray = useSelector(
    state => state.firestore.data.games[gameCode].playersArray
  )
  const players = useSelector(state => state.firestore.data.players)
  // const players = useSelector((state) => state.players)
  const [ready, setReady] = useState(false)
  // let arrayOfPlayerPathsAndGame = []
  // console.log("GameView loaded!")

  console.log('playersArray: ', playersArray)
  console.log('players from firestore', players)

  const arrayOfPlayerPathsAndGame = playersArray.map(playerId => {
    return {
      collection: 'players',
      doc: playerId
    }
  })
  arrayOfPlayerPathsAndGame.push({
    collection: 'games',
    doc: gameCode
  })

  useEffect(
    () => {
      if (players) {
        if (playersArray.length === Object.values(players).length) {
          console.log('THEY FINALLY MATCH')
          setReady(true)
        }
      }
    },
    [playersArray, players]
  )

  console.log('arrayOfPlayerPathsAndGame: ', arrayOfPlayerPathsAndGame)
  //console.log('PLAYERS!!!', players)
  useFirestoreConnect(arrayOfPlayerPathsAndGame)

  // Our redux state now has:
  // state.firestore.data.games[gameCode] for the game document
  // AND
  // state.firestore.data.players[playerId] for each player document
  let centerPanel
  if (ready) {
    centerPanel = (
      <div className="players">
        <div className="leftside">
          <div id="player1">
            <Player player={Object.values(players)[0]} />
          </div>
          {Object.values(players).length > 2 ? (
            <div id="player3">
              <Player player={Object.values(players)[2]} />
            </div>
          ) : (
            <div />
          )}
        </div>
        <div id="theGame">
          <GameBoard />
        </div>
        <div className="rightside">
          <div id="player2">
            <Player player={Object.values(players)[1]} />
          </div>

          {Object.values(players).length > 3 ? (
            <div id="player4">
              <Player player={Object.values(players)[3]} />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    )
  }
  console.log(centerPanel, 'CENTER PANEL')
  if (!players) {
    console.log(players, 'VALUE OF')
    return null
  }
  return (
    <div id="mainScreen">
      <div id="topBar">
        <GameViewTitle />
      </div>
      {centerPanel}
    </div>
  )
}

export default CurrentGame