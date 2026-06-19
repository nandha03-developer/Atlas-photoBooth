import React from 'react'
import Header from '../../../components/layout/headers/Header'
import HeroFour from '../../../components/homes/heros/HeroFour'
import FooterOne from "../../../components/layout/footers/FooterOne";
import EventsFour from '../../../components/homes/events/EventsFour'
import Preloader from '../../../components/common/Preloader'

export const metadata = {
  title: 'Purpose of Business || Atlasfotobooth - Professional LMS Online Education Course NextJS Template',
  description:
    'Atlas fotobooth offers a premium photo booth experience for weddings, parties, corporate events, and more. Capture unforgettable memories with our stylish and fun photo booths',
  
}
export default function page() {
  return (
    <>
    <div className='main-content'>
    <Preloader as="style"/>
    <Header />
    </div>
     <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <HeroFour/>
        <FooterOne/>

     </div>
     </>
  )
}
