import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link2, BarChart3, Brain, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      step: "01",
      title: t('how-it-works.step1.title'),
      description: t('how-it-works.step1.desc'),
      icon: Link2,
      details: ["一键授权连接", "实时数据同步", "安全加密传输"],
      color: "bg-blue-500"
    },
    {
      step: "02", 
      title: t('how-it-works.step2.title'),
      description: t('how-it-works.step2.desc'),
      icon: BarChart3,
      details: ["多维度数据整合", "趋势识别分析", "异常检测预警"],
      color: "bg-green-500"
    },
    {
      step: "03",
      title: t('how-it-works.step3.title'),
      description: t('how-it-works.step3.desc'),
      icon: Brain,
      details: ["科学评分算法", "A-C等级划分", "详细分析报告"],
      color: "bg-purple-500"
    },
    {
      step: "04",
      title: t('how-it-works.step4.title'),
      description: t('how-it-works.step4.desc'),
      icon: Zap,
      details: ["预算智能分配", "ROI优化建议", "投资机会匹配"],
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('how-it-works.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('how-it-works.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('how-it-works.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-8 h-0.5 bg-border z-0 transform translate-x-4">
                    <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                <Card className="relative z-10 h-full border-0 shadow-soft hover:shadow-medium transition-smooth group-hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mb-4">
                      <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto shadow-medium group-hover:shadow-strong transition-smooth`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 flex items-center justify-center font-bold text-xs"
                      >
                        {step.step}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-card rounded-3xl p-12 shadow-medium">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              准备开始你的数据驱动之旅？
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              立即连接你的数据源，让AI为你生成专业的Agent Score，获得智能的增长建议
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" className="group">
                立即开始免费试用
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                预约产品演示
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;