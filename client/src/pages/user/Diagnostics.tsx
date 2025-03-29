import { useEffect, useState } from "react";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";
import NavBar from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MdDirections } from "react-icons/md";
import { toast } from "sonner";

interface IResultPredict {
  disease: string;
  description: string;
}

interface IResultNearby {
  name: string;
  description: string;
  address: string;
  rating: string;
  link: string;
}

export default function Diagnostics() {
  const [symptomsText, setSymptomsText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPredict, setIsPredict] = useState(true);
  const [isInfo, setIsInfo] = useState(true);
  const [isNearby, setIsNearby] = useState(true);
  const [resultPredict, setResultPredict] = useState<IResultPredict>({
    disease: "",
    description: "",
  });
  const [resultInfo, setResultInfo] = useState("");
  const [resultNearby, setResultNearby] = useState<IResultNearby[]>([]);

  const handlePredict = async () => {
    setIsLoading(false);
    await axios
      .post("/api/v1/diagnostics/predict", {
        symptomsText,
      })
      .then((response) => {
        setIsPredict(false);
        setResultPredict(response.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          `Error ${err.response.data.error.code}: ${err.response.data.error.message}`
        );
        setSymptomsText("");
        setIsLoading(true);
      });
  };

  useEffect(() => {
    if (isPredict) return;
    async function fetchData() {
      await axios
        .post("/api/v1/diagnostics/info", {
          disease: resultPredict.disease,
        })
        .then(async (response) => {
          setIsInfo(false);
          setResultInfo(response.data);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            `Error ${err.response.data.error.code}: ${err.response.data.error.message}`
          );
          setSymptomsText("");
          setIsLoading(true);
        });
    }
    fetchData();
  }, [isPredict]);

  useEffect(() => {
    if (isPredict) return;
    async function fetchData() {
      const coordinates = await Geolocation.getCurrentPosition();
      await axios
        .post("/api/v1/nearby/search", {
          name: `doctors for ${resultPredict.disease}`,
          location: `${coordinates.coords.latitude},${coordinates.coords.longitude}`,
        })
        .then((response) => {
          console.log(response.data);
          setIsNearby(false);
          setResultNearby(response.data);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            `Error ${err.response.data.error.code}: ${err.response.data.error.message}`
          );
          setSymptomsText("");
          setIsLoading(true);
        });
    }
    fetchData();
  }, [isPredict]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <NavBar backBtn />
      {isLoading ? (
        <div className="relative p-4 border border-gray-700 rounded text-gray-300">
          <p className="text-2xl text-center mb-6">Diagnostics</p>
          <Textarea
            placeholder="Describe How You Are Feeling Right Now..."
            className="bg-transparent border-gray-700 focus:border-gray-500 mb-5 h-32 rounded"
            value={symptomsText}
            onChange={(e) => setSymptomsText(e.target.value)}
          />

          <Button
            className="w-full"
            variant="secondary"
            onClick={handlePredict}
          >
            Submit
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="p-4 space-y-5 border border-gray-700 rounded text-gray-300">
            <p className="text-2xl text-center">Diagnostics Results</p>
            <div className="space-y-8">
              <div className="text-gray-400">
                <p className="text-xl">Symptoms Described:</p>
                <p className="text-lg">"{symptomsText}"</p>
              </div>
              <div className="text-gray-400">
                <p className="text-xl">You most likely have:</p>
                <p className="text-lg text-gray-200">
                  {isPredict ? "Loading..." : resultPredict.disease}
                </p>
              </div>
              <div className="text-gray-400">
                <p className="text-xl">
                  <span>What is "{resultPredict.disease}" ? </span>
                  <span>(Powered by Gemini)</span>
                </p>
                <p className="text-lg">{isInfo ? "Loading..." : resultInfo}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-10 border border-gray-700 rounded text-gray-300">
            <div className="space-y-4">
              <p className="text-2xl text-center">Doctors / Hospitals Nearby</p>
              <div className="space-y-3">
                {isNearby ? (
                  <p className="text-xl text-center">Loading...</p>
                ) : (
                  resultNearby.map((item, index) => (
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
                          <MdDirections className="h-7 w-7" />
                        </a>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
