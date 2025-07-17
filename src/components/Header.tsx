import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signOut, loading } = useAuth();

  const navigation = [
    { name: t('nav.features'), href: "#features" },
    { name: t('nav.how-it-works'), href: "#how-it-works" },
    { name: t('nav.agent-score'), href: "#agent-score" },
    { name: t('nav.pricing'), href: "#pricing" },
    { name: t('nav.case-studies'), href: "#case-studies" }
  ];

  const projectNavigation = [
    { name: t('nav.projects'), to: "/projects" },
    { name: t('nav.leaderboard'), to: "/leaderboard" },
    { name: "🚀 演示测试", to: "/test-setup" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Agentboostr</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
            {projectNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={signOut}
                      className="gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      退出
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button variant="hero" size="sm">
                        {t('nav.free-trial')}
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="flex flex-col gap-4 py-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {projectNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <LanguageSwitcher />
                {!loading && (
                  <>
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={signOut}
                          className="gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          退出
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Link to="/auth">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <User className="h-4 w-4" />
                            {t('nav.login')}
                          </Button>
                        </Link>
                        <Link to="/auth">
                          <Button variant="hero" size="sm">
                            {t('nav.free-trial')}
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;