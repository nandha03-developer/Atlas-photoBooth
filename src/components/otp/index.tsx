import React from 'react'
import Otp from './otpComponent'

import Head from 'next/head'

function index() {
  return (
    <div>
      <Head>
        <title>OTP</title>
        <meta
          name="otp"
          content="At LaabamOne, we are more than just creators of software; we are architects of transformation"
          key="desc"
        />
      </Head>
      <Otp/>
      </div>
  )
}

export default index