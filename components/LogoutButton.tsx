'use client'
import React from 'react'
import userAuth from "../functions/userAuth"

const LogoutButton = () => {
  return (
    <button className='btn' onClick={() => {userAuth.logOut()}}>Logout</button>
  )
}

export default LogoutButton