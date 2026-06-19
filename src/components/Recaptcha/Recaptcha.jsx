import { useEffect, useCallback } from 'react';
 
const ReCaptcha = ({ onVerify }) => {
  const memoizedOnVerify = useCallback(onVerify, []);
 
  useEffect(() => {
    const loadReCaptcha = () => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!window.grecaptcha) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.onload = () => {
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
              window.grecaptcha.execute(siteKey, { action: 'submit' })
                .then(token => {
                  if (token) {
                    memoizedOnVerify(token);
                  } else {
                    console.error('Received null token.');
                    
                  }
                })
                .catch(error => {
                  console.error('Error executing reCAPTCHA:', error);
                });
            });
          } else {
            console.error('grecaptcha not loaded');
          }
        };
        script.onerror = () => {
          console.error('Failed to load reCAPTCHA script');
        };
        document.body.appendChild(script);
      } else {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action: 'submit' })
            .then(token => {
              if (token) {
                memoizedOnVerify(token);
              } else {
                console.error('Received null token.');
              }
            })
            .catch(error => {
              console.error('Error executing reCAPTCHA:', error);
            });
        });
      }
    };
 
    loadReCaptcha();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedOnVerify]);
 
  return null;
};
 
export default ReCaptcha;
 