// pages/api/reviews.js
import fetch from 'node-fetch';

export default async (req, res) => {
  const { placeId } = req.query;

  const apiKey = process.env.EXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const reviews = data.result.reviews;
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
