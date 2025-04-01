import { useEffect, useState } from "react";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";
import NavBar from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MdDirections } from "react-icons/md";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

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
  const [diagnosisInProgress, setDiagnosisInProgress] = useState(false);
  const [isPredict, setIsPredict] = useState(true);
  const [isInfo, setIsInfo] = useState(true);
  const [isNearby, setIsNearby] = useState(true);
  const [resultPredict, setResultPredict] = useState<IResultPredict>({
    disease: "",
    description: "",
  });
  const [resultInfo, setResultInfo] = useState("");
  const [resultNearby, setResultNearby] = useState<IResultNearby[]>([]);
  const [predictError, setPredictError] = useState<string | null>(null);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [nearbyError, setNearbyError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!symptomsText.trim()) {
      toast.error("Please describe your symptoms first");
      return;
    }

    try {
      setDiagnosisInProgress(true);
      setIsLoading(false);
      setPredictError(null);
      setInfoError(null);
      setNearbyError(null);

      const response = await axios.post("/api/v1/diagnostics/predict", {
        symptomsText,
      });

      setIsPredict(false);
      setResultPredict(response.data);
    } catch (error) {
      console.error("Prediction error:", error);
      setIsLoading(true);

      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const errorMessage =
          error.response.data?.error?.message || "Unknown error occurred";

        setPredictError(
          `Failed to analyze symptoms (${statusCode}): ${errorMessage}`
        );
        toast.error(`Error: ${errorMessage}`);
      } else {
        setPredictError(
          "Failed to analyze symptoms. Please check your connection and try again."
        );
        toast.error("Connection error. Please try again.");
      }
    } finally {
      setDiagnosisInProgress(false);
    }
  };

  useEffect(() => {
    if (isPredict) return;

    async function fetchDiseaseInfo() {
      try {
        setInfoError(null);

        const response = await axios.post("/api/v1/diagnostics/info", {
          disease: resultPredict.disease,
        });

        setIsInfo(false);
        setResultInfo(response.data);
      } catch (error) {
        console.error("Disease info error:", error);

        if (axios.isAxiosError(error) && error.response) {
          const statusCode = error.response.status;
          const errorMessage =
            error.response.data?.error?.message || "Unknown error occurred";

          setInfoError(
            `Failed to get disease information (${statusCode}): ${errorMessage}`
          );
          toast.error(`Error: ${errorMessage}`);
        } else {
          setInfoError(
            "Failed to get disease information. Please check your connection."
          );
        }
      }
    }

    fetchDiseaseInfo();
  }, [isPredict, resultPredict.disease]);

  useEffect(() => {
    if (isPredict) return;

    async function fetchNearbyDoctors() {
      try {
        setNearbyError(null);

        const coordinates = await Geolocation.getCurrentPosition();

        const response = await axios.post("/api/v1/nearby/search", {
          name: `doctors for ${resultPredict.disease}`,
          location: `${coordinates.coords.latitude},${coordinates.coords.longitude}`,
        });

        setIsNearby(false);

        if (!response.data || response.data.length === 0) {
          setNearbyError("No doctors found in your area for this condition.");
          return;
        }

        setResultNearby(response.data);
      } catch (error) {
        console.error("Nearby doctors error:", error);

        if ((error as GeolocationPositionError).code === 1) {
          setNearbyError(
            "Location access denied. Please enable location services to find nearby doctors."
          );
        } else if (axios.isAxiosError(error) && error.response) {
          const statusCode = error.response.status;
          const errorMessage =
            error.response.data?.error?.message || "Unknown error occurred";

          setNearbyError(
            `Failed to find nearby doctors (${statusCode}): ${errorMessage}`
          );
          toast.error(`Error: ${errorMessage}`);
        } else {
          setNearbyError(
            "Failed to find nearby doctors. Please check your connection."
          );
        }
      }
    }

    fetchNearbyDoctors();
  }, [isPredict, resultPredict.disease]);

  const resetDiagnosis = () => {
    setIsLoading(true);
    setIsPredict(true);
    setIsInfo(true);
    setIsNearby(true);
    setSymptomsText("");
    setPredictError(null);
    setInfoError(null);
    setNearbyError(null);
    setResultPredict({ disease: "", description: "" });
    setResultInfo("");
    setResultNearby([]);
  };

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
            disabled={diagnosisInProgress || !symptomsText.trim()}
          >
            {diagnosisInProgress ? "Analyzing Symptoms..." : "Submit"}
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="p-4 space-y-5 border border-gray-700 rounded text-gray-300">
            <p className="text-2xl text-center">Diagnostics Results</p>

            {predictError && (
              <div className="p-4 border border-red-700 bg-red-900/20 rounded-md flex gap-2 items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-red-400">{predictError}</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={resetDiagnosis}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {!predictError && (
              <div className="space-y-8">
                <div className="text-gray-400">
                  <p className="text-xl">Symptoms Described:</p>
                  <p className="text-lg">"{symptomsText}"</p>
                </div>
                <div className="text-gray-400">
                  <p className="text-xl">You most likely have:</p>
                  <p className="text-lg text-gray-200">
                    {isPredict ? "Analyzing..." : resultPredict.disease}
                  </p>
                </div>
                <div className="text-gray-400">
                  <p className="text-xl">
                    <span>What is "{resultPredict.disease}" ? </span>
                    <span>(Powered by Gemini)</span>
                  </p>
                  {infoError ? (
                    <div className="p-2 border border-amber-700 bg-amber-900/20 rounded-md text-amber-400 text-sm mt-2">
                      {infoError}
                    </div>
                  ) : (
                    <p className="text-lg">
                      {isInfo ? "Loading information..." : resultInfo}
                    </p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  className="dark w-full bg-slate-500/20 hover:bg-slate-500/30"
                  onClick={resetDiagnosis}
                >
                  Start New Diagnosis
                </Button>
              </div>
            )}
          </div>

          {!predictError && (
            <div className="p-4 space-y-10 border border-gray-700 rounded text-gray-300">
              <div className="space-y-4">
                <p className="text-2xl text-center">
                  Doctors / Hospitals Nearby
                </p>

                {nearbyError ? (
                  <div className="p-4 border border-amber-700 bg-amber-900/20 rounded-md flex gap-2 items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <p className="text-amber-400">{nearbyError}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isNearby ? (
                      <p className="text-xl text-center">
                        Searching for nearby doctors...
                      </p>
                    ) : resultNearby.length > 0 ? (
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
                    ) : (
                      <p className="text-xl text-center">
                        No nearby doctors found
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
