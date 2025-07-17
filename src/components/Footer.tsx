import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Brain, Mail, Twitter, Linkedin, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  const footerLinks = {
    product: [
      { name: t('footer.product.integration'), href: "#features" },
      { name: t('footer.product.score'), href: "#pricing" },
      { name: t('footer.product.ads'), href: "#api" },
      { name: t('footer.product.investment'), href: "#integrations" }
    ],
    company: [
      { name: t('footer.company.about'), href: "#about" },
      { name: t('footer.company.contact'), href: "#investors" },
      { name: t('footer.company.careers'), href: "#news" },
      { name: t('footer.company.blog'), href: "#careers" }
    ],
    resources: [
      { name: t('footer.support.docs'), href: "#help" },
      { name: t('footer.support.api'), href: "#docs" },
      { name: t('footer.support.help'), href: "#case-studies" },
      { name: t('footer.support.community'), href: "#best-practices" }
    ],
    legal: [
      { name: t('footer.legal.terms'), href: "#terms" },
      { name: t('footer.legal.privacy'), href: "#privacy" },
      { name: t('footer.legal.security'), href: "#security" },
      { name: "GDPR合规", href: "#gdpr" }
    ]
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Agentboostr</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.product')}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-primary-foreground/70">
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/70">
            <span>服务于全球500+创业团队</span>
            <span>•</span>
            <span>GDPR合规认证</span>
            <span>•</span>
            <span>ISO 27001安全标准</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;