import Preloader from '../../../components/common/Preloader'
import React from 'react';
import OtpComponent from '../../../components/otp/otpComponent'


export const metadata = {
  title: 'Terms || Educrat - Professional LMS Online Education Course NextJS Template',
  description:
    'Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.',
};

export default function Page() {
  return (
    <div className="main-content">
      <Preloader />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <OtpComponent />
      </div>
    </div>
  );
}
