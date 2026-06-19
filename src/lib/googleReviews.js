import axios from 'axios';

const fetchGoogleReviews = async (placeId) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.result.reviews;
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return [];
  }
};

export default fetchGoogleReviews;
