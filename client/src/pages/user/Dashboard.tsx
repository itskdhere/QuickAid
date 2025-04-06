import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Ambulance,
  Building2,
  Phone,
  Activity,
  PersonStanding,
  Heart,
  AlertTriangle,
} from "lucide-react";
import Gemini from "@/components/Gemini";

type THealthTips = {
  title: string;
  description: string;
};

const emergencyContacts = [
  { title: "Emergency Helpline", number: "112" },
  { title: "Medical Support", number: "102" },
  { title: "Police", number: "100" },
  { title: "Fire", number: "101" },
  { title: "Women Helpline ", number: "1091" },
  { title: "LPG Leak Helpline", number: "1906" },
];

export default function Dashboard() {
  const [tips, setTips] = useState<THealthTips[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get("/api/v1/misc/tips", {
          withCredentials: true,
        });

        if (response.status === 200 && response.data && response.data.tips) {
          setTips(response.data.tips);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching health tips:", error);

        if (axios.isAxiosError(error)) {
          // Handle specific HTTP errors
          if (error.response) {
            if (error.response.status === 401) {
              setError("You need to be logged in to view health tips.");
            } else if (error.response.status === 404) {
              setError("No health tips found. Please try again later.");
            } else {
              setError(
                `Server error: ${error.response.status}. Please try again later.`
              );
            }
          } else if (error.request) {
            // Request was made but no response received
            setError("Network issue. Please check your internet connection.");
          } else {
            setError("An error occurred. Please try again later.");
          }
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }

        setTips([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      {/* Header */}
      <NavBar />

      {/* Services Section */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          Quick Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/user/diagnostics">
            <ServiceCard
              icon={<AlertCircle className="w-6 h-6 text-yellow-400" />}
              title="Self Diagnostics"
              subtitle="Diagnose your symptoms & contact doctors"
              gradient="from-yellow-500/10 to-orange-500/10"
            />
          </Link>
          <Link to="/user/nearby">
            <ServiceCard
              icon={<Building2 className="w-6 h-6 text-blue-400" />}
              title="Nearby Search"
              subtitle="Find nearby doctors, hospitals, pharmacies, dentists"
              gradient="from-blue-500/10 to-cyan-500/10"
            />
          </Link>
          <Link to="/user/ambulance">
            <ServiceCard
              icon={<Ambulance className="w-6 h-6 text-red-400" />}
              title="Emergency Ambulance"
              subtitle="Get ambulance in case of any emergency"
              gradient="from-red-500/10 to-pink-500/10"
            />
          </Link>
          <Link to="/user/community">
            <ServiceCard
              icon={<PersonStanding className="w-6 h-6 text-green-400" />}
              title="Community Fourm"
              subtitle="Interact with others users & share your experiences"
              gradient="from-green-500/10 to-emerald-500/10"
            />
          </Link>
        </div>
      </section>

      {/* Health Tips */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          <span>
            Health Tips Powered by
            <Gemini className="inline h-6 ml-2 mr-1 -translate-y-1.5" />
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            <p className="text-xl text-gray-300">Loading health tips...</p>
          ) : error ? (
            <Card className="bg-gradient-to-r from-red-500/10 to-red-700/10 border-red-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-200">Error</h3>
                    <p className="text-gray-400">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : tips.length > 0 ? (
            tips.map((tip, index) => (
              <Card
                key={index}
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-gray-700"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-200">
                        {tip.title}
                      </h3>
                      <p className="text-gray-400">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-xl text-gray-300">No health tips available.</p>
          )}
        </div>
      </section>

      {/* Emergency Contacts Carousel */}
      <div className="relative bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-gray-700 rounded-lg mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-400" />
            Emergency Contacts
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium mb-1 text-gray-300">
                        {contact.title}
                      </h3>
                      <p className="text-2xl font-bold text-blue-400">
                        {contact.number}
                      </p>
                    </div>
                    <a href={`tel:${contact.number}`}>
                      <Phone className="text-red-400" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  subtitle,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <Card
      className={`bg-gradient-to-r ${gradient} border-gray-700 hover:scale-[1.02] transition-transform`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-700 bg-gray-800/50">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1 text-gray-200">{title}</h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
