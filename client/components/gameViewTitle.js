import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

const GameViewTitle = () => {
  const [reload, setReload] = useState(false)
  const players = useSelector(state => state.firestore.data.players)

  useEffect(
    () => {
      setReload(!reload)
    },
    [players]
  )

  function getCurrentPlayer() {
    return Object.values(players)[0]
  }

  return (
    <div id="gameViewTitle">
      {players ? (
        <h2>It's {getCurrentPlayer().startupName}'s turn!</h2>
      ) : (
        <div>
          <h2>Getting data...</h2>
        </div>
      )}
    </div>
  )
}

export default GameViewTitle
