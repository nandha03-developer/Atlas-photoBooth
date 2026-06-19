import Faq from '../../../components/common/Faq'
import Preloader from '../../../components/common/Preloader'
import FooterOne from '../../../components/layout/footers/FooterOne'
import Header from '../../../components/layout/headers/Header'
import React from 'react'

export const metadata = {
  title: 'FAQ || Atlasfotobooth - Professional LMS Online Education Course NextJS Template',
  description:
    'Atlas Photo Booth offers a premium photo booth experience for weddings, parties, corporate events, and more. Capture unforgettable memories with our stylish and fun photo booths',
}
export default function page() {
  return (
    <div className="main-content  ">
      <Preloader/>
        <Header/>
        <div className="content-wrapper js-content-wrapper overflow-hidden">
          <Faq/>
            <FooterOne/>
        </div>

    </div>
  )
}
