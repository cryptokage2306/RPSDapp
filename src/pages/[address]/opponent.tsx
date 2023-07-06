import { useRouter } from 'next/router'
import React from 'react'
import PentagonOpponent from '../../components/PentagonOpponent'

const Opponent = () => {
    const {query: {address}} = useRouter()
  return (
    <PentagonOpponent />
  )
}


export default Opponent