import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageNavigationProps {
  title?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  className?: string;
}

export function PageNavigation({ 
  title, 
  showHomeButton = true, 
  showBackButton = true,
  className = ""
}: PageNavigationProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('nav.back')}
          </Button>
        )}
        {showHomeButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleHome}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            {t('nav.home')}
          </Button>
        )}
      </div>
      
      {title && (
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      )}
    </div>
  );
}