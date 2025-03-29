import { useState } from "react";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MdDirections, MdLocationPin, MdClear } from "react-icons/md";

interface INearbyItem {
  name: string;
  description: string;
  address: string;
  rating: string;
  link: string;
}

export default function Ambulance() {
  const [nearby, setNearby] = useState<INearbyItem[]>([]);
  const [location, setLocation] = useState("");

  async function handleFind() {
    let res;
    const coordinatePattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    if (coordinatePattern.test(location)) {
      res = await axios.post("/api/v1/nearby/search", {
        location,
        name: "ambulance",
      });
    } else {
      const r = await axios.post("/api/v1/nearby/geocode", {
        address: location,
      });
      res = await axios.post("/api/v1/nearby/search", {
        location: `${r.data.lat},${r.data.lng}`,
        name: "ambulance",
      });
    }

    setNearby(res.data);
  }

  return (
    <div className="min-h-screen space-y-10 bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <NavBar backBtn />
      <div className="mx-auto space-y-6 relative p-4 border border-gray-700 rounded text-gray-300">
        {/* Header */}
        <p className="text-2xl text-center mb-6">Ambulance</p>

        {/* Search Section */}
        <div className="rounded-lg p-4 space-y-4">
          <Input
            placeholder="Type any location..."
            className="border-zinc-800 text-zinc-50 placeholder:text-zinc-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="space-x-4">
            <Button
              variant="default"
              onClick={async () => {
                const coordinates = await Geolocation.getCurrentPosition();
                setLocation(
                  `${coordinates.coords.latitude},${coordinates.coords.longitude}`
                );
              }}
            >
              <MdLocationPin className="h-5 w-5" />
              Use Current Location
            </Button>
            <Button variant="default" onClick={() => setLocation("")}>
              <MdClear className="h-5 w-5" />
            </Button>
          </div>
          <Button onClick={handleFind} className="w-full" variant="secondary">
            Find Ambulance
          </Button>
        </div>
      </div>

      {nearby.length > 1 && (
        <div className="p-4 space-y-10 border border-gray-700 rounded text-gray-300">
          <div className="space-y-4">
            <h2 className="mb-2 text-2xl text-center">Search Results</h2>
            <div className="space-y-3">
              {nearby.map((item, index) => (
                <Card
                  key={index}
                  className="p-4 bg-transparent text-gray-300 border-gray-800 flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <h2 className="">{item?.name}</h2>
                    <p className="">Address: {item?.address}</p>
                    <h3 className="">
                      Type: {item?.description.split(",")[0]}
                    </h3>
                    <p className="">Rating: {item?.rating}</p>
                  </div>
                  <div className="h-6 w-6 rounded-ful">
                    <a
                      href={item?.link}
                      target="_blank"
                      rel="noreferrer"
                      className="h-6 w-6 rounded-full bg-gray-800"
                    >
                      <MdDirections className="h-6 w-6" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
