import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, BarChart, Brain, TrendingUp, Users, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: CreditCard,
      title: t('features.stripe.title'),
      description: t('features.stripe.desc'),
      benefits: ["实时数据同步", "安全OAuth认证", "全面财务分析"],
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: BarChart,
      title: t('features.ga.title'),
      description: t('features.ga.desc'),
      benefits: ["多属性支持", "用户行为洞察", "转化路径分析"],
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: Brain,
      title: t('features.score.title'),
      description: t('features.score.desc'),
      benefits: ["多维度评估", "等级划分A-C", "改进建议"],
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: t('features.ads.title'),
      description: t('features.ads.desc'),
      benefits: ["自动预算计算", "多渠道优化", "ROI预测"],
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      icon: Users,
      title: t('features.investment.title'),
      description: t('features.investment.desc'),
      benefits: ["投资对接", "创业辅导", "资源连接"],
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.desc'),
      benefits: ["数据安全", "隐私保护", "合规认证"],
      color: "bg-gradient-to-br from-red-500 to-red-600"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('features.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-strong transition-smooth border-0 gradient-card"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-spring`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;