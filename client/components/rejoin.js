import React, {useState, useEffect} from 'react'
import {connect, useSelector, useDispatch} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {useFirestoreConnect} from 'react-redux-firebase'
import {getGameThunk} from '../store/preGame'

const Rejoin = () => {
  const [gameCode, setGameCode] = useState('0F4Tr14nuz1TeQpLFwHd')
  const [redirectNow, setRedirectNow] = useState(false)
  const [clicked, setClicked] = useState(false)
  const dispatch = useDispatch()

  function handleChange(event) {
    setGameCode(event.target.value)
  }
  async function handleClick() {
    await dispatch(getGameThunk(gameCode))
    setRedirectNow(true)
    // setClicked(true)
  }

  // if (clicked) {
  //   // useFirestoreConnect([{collection: 'games', doc: gameCode}])
  //   setRedirectNow(true)
  // }

  // useEffect () {
  //   if ()
  //   setRedirectNow(true)
  // }

  if (redirectNow) {
    return <Redirect to="/loading" />
  }

  return (
    <div className="welcome">
      <div>
        <input type="text" value={gameCode} onChange={handleChange} />
        <button type="button" onClick={handleClick}>
          Rejoin
        </button>
      </div>
    </div>
  )
}

export default Rejoin
