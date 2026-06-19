







import { Box } from '@mui/material'
import Insta from '../../../components/common/Insta'

import Preloader from '../../../components/common/Preloader'

import FooterOne from '../../../components/layout/footers/FooterOne'
import Header from '../../../components/layout/headers/Header'

import React from 'react'

export const metadata = {
  title: 'Social Media || Atlasfotobooth ',
  description:
    'Atlasfotobsooth offers a premium photo booth experience for weddings, parties, corporate events, and more. Capture unforgettable memories with our stylish and fun photo booths',
  
}
export default function page() {
  return (<>
    {/* <div className="main-content  ">
      <Preloader/>

        <Header/>
        <div className="content-wrapper js-content-wrapper overflow-hidden">
            <Insta/>
        </div>
        
        <FooterOne/>
    </div> */}
    <div className="main-content">
        <Preloader />
    
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(5px)",
            }}
          >
            <Header />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Insta/>
            </Box>
            <FooterOne />
          </Box>
        </Box>
      </div>
    </>
  )
}

