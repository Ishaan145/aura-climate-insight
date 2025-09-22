import { AnimatePresence } from 'framer-motion';
import { useRouter } from '../hooks/useRouter';
import Index from '../pages/Index';
import PredictPage from '../pages/PredictPage';
import NotFound from '../pages/NotFound';

// Placeholder components for other pages
const AboutPage = () => <div className="pt-24 container mx-auto px-4"><h1 className="text-4xl font-bold">About AuraCast</h1><p className="mt-4 text-muted-foreground">Learn about our climatological risk assessment platform.</p></div>;
const FaqPage = () => <div className="pt-24 container mx-auto px-4"><h1 className="text-4xl font-bold">FAQ</h1><p className="mt-4 text-muted-foreground">Frequently asked questions about AuraCast.</p></div>;
const CommunityPage = () => <div className="pt-24 container mx-auto px-4"><h1 className="text-4xl font-bold">Community</h1><p className="mt-4 text-muted-foreground">Connect with other AuraCast users.</p></div>;
const LoginPage = () => <div className="pt-24 container mx-auto px-4"><h1 className="text-4xl font-bold">Login</h1><p className="mt-4 text-muted-foreground">Sign in to your account.</p></div>;
const RegisterPage = () => <div className="pt-24 container mx-auto px-4"><h1 className="text-4xl font-bold">Register</h1><p className="mt-4 text-muted-foreground">Create your AuraCast account.</p></div>;

const MainContent = () => {
  const { currentPage } = useRouter();

  const pages = {
    home: Index,
    predict: PredictPage,
    about: AboutPage,
    faq: FaqPage,
    community: CommunityPage,
    login: LoginPage,
    register: RegisterPage,
  };

  const PageComponent = pages[currentPage as keyof typeof pages] || NotFound;

  return (
    <main>
      <AnimatePresence mode="wait">
        <PageComponent key={currentPage} />
      </AnimatePresence>
    </main>
  );
};

export default MainContent;