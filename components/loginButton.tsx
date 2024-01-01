'use client'

import React from 'react'
import userAuth from "../functions/userAuth"

const LoginButton = () => {
  return (
    <button className='btn' onClick={() => userAuth.googleLogIn()}>Login</button>
  )
}

export default LoginButton