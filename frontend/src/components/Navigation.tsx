import { useState, useEffect } from "react";
import { Link, useHref, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Mic, Globe, User, ChevronDown } from "lucide-react";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, currentLanguage, setLanguage, getCurrentLanguage } = useLanguage();

  const navItems = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.soilAnalysis'), href: "/soil" },
    { name: t('nav.diseaseDetection'), href: "/disease" },
    { name: t('nav.fertilizerPlans'), href: "/fertilizer" },
    { name: t('nav.weather'), href: "/weather" },
    { name: t('nav.marketPrices'), href: "/market" },
    { name: t('nav.projects'), href: "/projects" },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as any);
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      toast.error(err.message || "logoutfailed");
    } 
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌾</span>
            </div>
            <span className="text-xl font-bold text-primary">{t('nav.home') === 'Home' ? 'Smart Crop Advisor' :'స్మార్ట్ ఫసల్ సలహాదారు'  }</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Voice & Language Controls */}
          <div className="hidden md:flex items-center space-x-3">
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4" />
                  {getCurrentLanguage().nativeName}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border shadow-large z-50 min-w-[200px]">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-xs text-muted-foreground">{lang.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {!isLoggedIn && (
              <>
                <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                  <User className="h-4 w-4" />
                  {t('nav.login')}
                </Button>
                <Button onClick={() => navigate('/signup')} variant="outline" size="sm">
                  <User className="h-4 w-4" />
                  {t('nav.register') ?? "Register"}
                </Button>
              </>
            )}
            {isLoggedIn && (
              <Button onClick={handleLogout} variant="outline" size="sm">
                <User className="h-4 w-4" />
                {t('nav.logout') ?? "Logout"}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button variant="voice" className="w-full" size="sm">
                <Mic className="h-4 w-4" />
                {t('nav.voice')}
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Globe className="h-4 w-4" />
                {getCurrentLanguage().nativeName}
              </Button>
              {!isLoggedIn && (
                <>
                  <Button onClick={() => navigate('/login')} variant="outline" className="w-full" size="sm">
                    <User className="h-4 w-4" />
                    {t('nav.login')}
                  </Button>
                  <Button onClick={() => navigate('/signup')} variant="outline" className="w-full" size="sm">
                    <User className="h-4 w-4" />
                    {t('nav.register') ?? "Register"}
                  </Button>
                </>
              )}
              {isLoggedIn && (
                <Button onClick={handleLogout} variant="outline" className="w-full" size="sm">
                  <User className="h-4 w-4" />
                  {t('nav.logout') ?? "Logout"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;