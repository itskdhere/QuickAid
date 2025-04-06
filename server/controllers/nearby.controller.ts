import { Request, Response } from "express";
import axios from "axios";
import { z } from "zod";

async function geocode(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const uriEncodedAddress = encodeURIComponent(address);

  const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=${apiKey}`;

  let location = null;

  await axios
    .get(googleMapsUrl)
    .then((response) => {
      location = response.data.results[0].geometry.location;
    })
    .catch((error) => {
      console.error("Error fetching geocode:", error);
      throw new Error(error);
    });

  return location;
}

export const nearbyGeocode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schema = z.object({
    address: z.string().trim().nonempty({ message: "Address is required" }),
  });

  const { address }: z.infer<typeof schema> = req.body;

  try {
    schema.parse({ address });
  } catch (err) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Invalid input data",
      },
    });
    return;
  }

  await geocode(address)
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((error) => {
      res.status(500).json({
        status: "error",
        error: { code: 500, message: error.message },
      });
      return;
    });
};

export const nearbySearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schema = z.object({
    name: z.string().trim().optional(),
    location: z.string().trim().optional(),
    filter: z.string().trim().optional(),
  });

  const { name, location, filter }: z.infer<typeof schema> = req.body;

  try {
    schema.parse({ name, location, filter });
  } catch (err) {
    console.error(err.errors);
    res.status(400).json({
      error: {
        code: 400,
        message: "Invalid input data",
      },
    });
    return;
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  let googleMapsUrl = "";

  if (name) {
    const keyword = encodeURIComponent(name);
    googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&keyword=${keyword}&rankby=distance&key=${apiKey}`;
  } else {
    googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&type=${filter}&radius=10000&rankby=prominence&key=${apiKey}`;
  }

  console.log(googleMapsUrl);

  await axios
    .get(googleMapsUrl)
    .then(async (result) => {
      const results = await result.data.results.map((place: any) => ({
        name: place.name,
        description: place.types?.join(", ") || "No description available",
        address: place.vicinity || "No address available",
        rating:
          `${place.rating} (${place.user_ratings_total})` ||
          "No rating available",
        link: `https://www.google.com/maps/search/?api=1&query=${
          place.geometry.location.lat
        },${place.geometry.location.lng}&query_place_id=${
          place.place_id
        }&query_name=${encodeURIComponent(place.name)}`,
      }));
      console.log(results);
      res.json(results);
      return;
    })
    .catch((error) => {
      console.error("Error fetching nearby places:", error);
      res.status(500).json({
        status: "error",
        error: { code: 500, message: error.message },
      });
      return;
    });
};
