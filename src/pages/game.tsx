import { useRouter } from 'next/router'
import React from 'react'
import PentagonFirstPlayer from '../components/PentagonFirstPlayer'

const Game = () => {
    const {query: {address}} = useRouter()
  return (
    <PentagonFirstPlayer />
  )
}


export default Game