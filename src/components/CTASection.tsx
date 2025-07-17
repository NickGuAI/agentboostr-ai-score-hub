import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Star, Users, TrendingUp, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const CTASection = () => {
  const { t } = useLanguage();
  
  const socialProof = [
    {
      icon: Users,
      metric: t('cta.metric1'),
      label: t('cta.metric1.label')
    },
    {
      icon: TrendingUp,
      metric: t('cta.metric2'),
      label: t('cta.metric2.label')
    },
    {
      icon: Star,
      metric: t('cta.metric3'),
      label: t('cta.metric3.label')
    }
  ];

  const benefits = [
    t('cta.benefit1'),
    t('cta.benefit2'), 
    t('cta.benefit3'),
    t('cta.benefit4'),
    t('cta.benefit5'),
    t('cta.benefit6')
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <Badge variant="outline" className="mb-6 bg-white/10 border-white/30 text-white">
            {t('cta.badge')}
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/test-setup">
              <Button variant="hero" size="xl" className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 border-0 shadow-glow">
                <Rocket className="w-5 h-5 mr-2" />
                立即体验演示
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/projects/new">
              <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                {t('cta.button1')}
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialProof.map((item, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-smooth">
                <CardContent className="p-6 text-center">
                  <item.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{item.metric}</div>
                  <div className="text-white/70 text-sm">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Partnership badges */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm mb-4">{t('cta.partners')}</p>
            <div className="flex items-center justify-center gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">a2aX Fund</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Taihill Venture</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;