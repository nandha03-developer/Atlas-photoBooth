// import HomeIcon from '@mui/icons-material/Home';
// import InfoIcon from '@mui/icons-material/Info';
// import DescriptionIcon from '@mui/icons-material/Description';
// import ImageIcon from '@mui/icons-material/Image';
// import ContactMailIcon from '@mui/icons-material/ContactMail';
// import LocalOfferIcon from '@mui/icons-material/LocalOffer';
// import RateReviewIcon from '@mui/icons-material/RateReview';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
// import { useUser } from '../context/UserDataContext';


// const getGalleryHref = () => {
//   // const { customer } = useUser(); // Access customer from context

//   // Check if customer exists in context or a token exists in localStorage
//   if (( typeof window!==undefined &&localStorage.getItem("Accesstoken") ||
//   typeof window!==undefined &&localStorage.getItem("usersubToken"))) {
//     return '/gallery'; // If either customer or token exists, link to gallery
//   }
//   return '/login'; // Otherwise, link to login
// };

const getGalleryHref = () => {
  // Ensure the code runs only on the client side
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('Accesstoken');
    const userSubToken = localStorage.getItem('usersubToken');
    if (accessToken || userSubToken) {
      return '/gallery'; // If either token exists, link to gallery
    }
  }
  return '/login'; // Otherwise, link to login
};

export const mobileMenuList = [
  {
    title: <a href="/"><HomeOutlinedIcon /> Home</a>,
  },
  {
    title: <a href="#"><InfoOutlinedIcon /> About-us</a>,
    links: [
      { href: "/purpose", label: <><DescriptionOutlinedIcon /> Purpose of Business</> },
      { href: "/faq", label: <><InfoOutlinedIcon /> FAQ</> },
      // { href: "/socialmedia", label: <><InfoOutlinedIcon /></> },
      { href: "/policy", label: <><DescriptionOutlinedIcon /> Policy</> },
    ],
  },
  {
    title: <a href="/package"><LocalOfferOutlinedIcon /> Package</a>,
  },
  {
    title: <a href="/review"><RateReviewOutlinedIcon /> Reviews</a>,
  },
  {
    title: <a href={getGalleryHref()}><ImageOutlinedIcon /> Gallery</a>,
  },
  {
    title: <a href="/contactus"><ContactMailOutlinedIcon /> Contact</a>,
  },
];
