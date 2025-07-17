import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PricingSection = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.lite.name'),
      price: t('pricing.lite.price'),
      description: t('pricing.lite.description'),
      features: [
        t('pricing.lite.feature1'),
        t('pricing.lite.feature2'),
        t('pricing.lite.feature3')
      ],
      cta: t('pricing.lite.cta'),
      popular: false,
      variant: 'outline' as const
    },
    {
      name: t('pricing.basic.name'),
      price: t('pricing.basic.price'),
      description: t('pricing.basic.description'),
      features: [
        t('pricing.basic.feature1'),
        t('pricing.basic.feature2'),
        t('pricing.basic.feature3'),
        t('pricing.basic.feature4')
      ],
      cta: t('pricing.basic.cta'),
      popular: false,
      variant: 'secondary' as const
    },
    {
      name: t('pricing.pro.name'),
      price: t('pricing.pro.price'),
      description: t('pricing.pro.description'),
      features: [
        t('pricing.pro.feature1'),
        t('pricing.pro.feature2'),
        t('pricing.pro.feature3'),
        t('pricing.pro.feature4')
      ],
      cta: t('pricing.pro.cta'),
      popular: true,
      variant: 'default' as const
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {t('pricing.popular')}
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.variant}
                  className="w-full py-6 text-base font-medium"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-muted-foreground">{t('pricing.footer.line1')}</p>
          <p className="text-sm text-muted-foreground">{t('pricing.footer.line2')}</p>
          <p className="text-sm text-muted-foreground">{t('pricing.footer.line3')}</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;