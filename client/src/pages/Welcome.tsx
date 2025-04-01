import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import {
  FaStethoscope,
  FaMapMarkerAlt,
  FaAmbulance,
  FaUsers,
  FaHeart,
  FaPhoneAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <Logo className="h-32 w-32" />,
    title: "QuickAid",
    description: "AI Powered Medical Assistance at Your Fingertips",
  },
  {
    icon: <FaStethoscope className="text-blue-500 text-3xl" />,
    title: "Self Diagnostics",
    description: "Get AI-powered symptoms analysis and preliminary guidance.",
  },
  {
    icon: <FaMapMarkerAlt className="text-red-500 text-3xl" />,
    title: "Find Nearby",
    description: "Locate the closest hospitals and clinics in your area.",
  },
  {
    icon: <FaAmbulance className="text-green-500 text-3xl" />,
    title: "Emergency Assistance",
    description: "Get ambulance services with your exact location.",
  },
  {
    icon: <FaUsers className="text-violet-500 text-3xl" />,
    title: "Community Support",
    description: "Connect with others and share health-related experiences.",
  },
  {
    icon: <FaHeart className="text-pink-500 text-3xl" />,
    title: "Health Tips",
    description:
      "Get personalized health tips and advice based on your profile.",
  },
  {
    icon: <FaPhoneAlt className="text-yellow-500 text-3xl" />,
    title: "Emergency Contacts",
    description: "Quick access to emergency contacts and helplines.",
  },
];

export default function Welcome() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentPage < features.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate("/auth/user/signup");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    navigate("/auth/user/signup");
  };

  useEffect(() => {
    async function fetchUser() {
      await axios
        .get("/api/v1/auth/user/whoami", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            navigate("/user/dashboard");
          }
        })
        .catch((error) => {
          if (error.response.data.error.code === 401) return;
        });
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Logo Section - Only show after first feature */}
      {currentPage > 0 && (
        <div className="flex items-center justify-center pt-10 pb-6">
          <div className="flex items-center gap-2">
            <Logo className="h-14 w-14" />
            <h1 className="text-3xl font-bold">QuickAid</h1>
          </div>
        </div>
      )}

      {/* Feature Carousel */}
      <div className="flex-grow flex flex-col items-center justify-center px-6">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="flex justify-center mb-8">
            {features[currentPage].icon}
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {features[currentPage].title}
          </h2>
          <p className="text-gray-300 mb-8">
            {features[currentPage].description}
          </p>
        </motion.div>

        {/* Pagination Indicators */}
        <div className="flex gap-2 mb-10">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentPage ? "bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="p-6 flex justify-between">
        {currentPage === 0 ? (
          <Button variant="default" onClick={handleSkip}>
            Skip
          </Button>
        ) : (
          <Button variant="default" onClick={handlePrevious}>
            Back
          </Button>
        )}
        <Button variant="secondary" onClick={handleNext}>
          {currentPage < features.length - 1 ? "Next" : "Get Started"}
        </Button>
      </div>
    </div>
  );
}
