import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
      <Button
        variant={language === 'zh' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('zh')}
        className="h-8 px-3 text-xs"
      >
        中文
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="h-8 px-3 text-xs"
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;