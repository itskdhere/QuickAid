import { useNavigate } from "react-router";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  FaStethoscope,
  FaMapMarkerAlt,
  FaAmbulance,
  FaUsers,
  FaHeart,
  FaPhoneAlt,
  FaGithub,
} from "react-icons/fa";
import BeforeInstallPromptEvent from "@/types/BeforeInstallPromptEvent";

function Landing({
  deferredPrompt,
}: {
  deferredPrompt: React.MutableRefObject<BeforeInstallPromptEvent | null>;
}) {
  const navigate = useNavigate();

  const handleInstall = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (deferredPrompt.current?.prompt && deferredPrompt.current.userChoice) {
      await deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === "accepted") {
        deferredPrompt.current = null;
        navigate("/welcome");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header/Navigation */}
      <header className="container max-w-6xl mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="h-11 w-11 translate-y-0.5" />
          <h1 className="text-2xl font-bold">QuickAid</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth/user/signin")}>
            Login
          </Button>
          <Button onClick={() => navigate("/auth/user/signup")}>Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-28 flex flex-col md:flex-row items-center">
        <div className="mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Powered Medical Assistance at Your Fingertips
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            QuickAid connects you to nearby medical help, emergency services,
            and provides diagnostic guidance when you need it most.
          </p>
          <div className="flex gap-4">
            <Button size="lg" onClick={() => navigate("/welcome")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={handleInstall}>
              Install App
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20 dark:bg-slate-800">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<FaStethoscope className="text-4xl text-blue-500" />}
            title="Self Diagnostics"
            description="Get AI-powered symptoms analysis and preliminary guidance."
          />
          <FeatureCard
            icon={<FaMapMarkerAlt className="text-4xl text-red-500" />}
            title="Find Nearby"
            description="Locate the closest hospitals, clinics, and emergency services in your area."
          />
          <FeatureCard
            icon={<FaAmbulance className="text-4xl text-green-500" />}
            title="Emergency Assistance"
            description="Get ambulance services with your exact location details."
          />
          <FeatureCard
            icon={<FaUsers className="text-4xl text-violet-500" />}
            title="Community Support"
            description="Connect with others and share health-related experiences."
          />
          <FeatureCard
            icon={<FaHeart className="text-4xl text-pink-500" />}
            title="Health Tips"
            description="Get personalized health tips and advice based on your profile."
          />
          <FeatureCard
            icon={<FaPhoneAlt className="text-4xl text-yellow-500" />}
            title="Emergency Contacts"
            description="Quick access to emergency contacts and helplines."
          />
        </div>
      </section>

      {/* Demo Video  */}
      <section className="container max-w-6xl mx-auto px-4 py-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-8">Demo Video</h2>
        <p>Coming Soon...</p>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/kjlNoOILAh4"
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
      </section>

      {/* Source Code */}
      <section className="container max-w-6xl mx-auto px-4 py-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-8">Source Code</h2>
        <a
          href="https://github.com/itskdhere/QuickAid"
          target="_blank"
          className="w-72"
        >
          <FeatureCard
            icon={<FaGithub className="text-4xl text-black" />}
            title="GitHub"
            description="itskdhere/QuickAid"
          />
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-slate-900 py-3 mt-5">
        <div className="container mx-auto px-3 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Built with by 💜 Turing Devs
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description}
      </p>
    </div>
  );
}

export default Landing;
