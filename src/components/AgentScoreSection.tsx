import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Zap, Shield, Target, Bot, AlertTriangle, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AgentScoreSection = () => {
  const { t } = useLanguage();
  
  const scoreBreakdown = [
    {
      category: t('agent-score.user-value.title'),
      weight: "30%",
      weightValue: 30,
      score: 82,
      icon: HeartHandshake,
      description: t('agent-score.user-value.description'),
      details: [
        t('agent-score.user-value.retention'),
        t('agent-score.user-value.conversion'),
        t('agent-score.user-value.ltv')
      ]
    },
    {
      category: t('agent-score.market-fit.title'),
      weight: "25%",
      weightValue: 25,
      score: 75,
      icon: Target,
      description: t('agent-score.market-fit.description'),
      details: [
        t('agent-score.market-fit.growth'),
        t('agent-score.market-fit.nps'),
        t('agent-score.market-fit.penetration')
      ]
    },
    {
      category: t('agent-score.technical-moat.title'),
      weight: "20%",
      weightValue: 20,
      score: 68,
      icon: Shield,
      description: t('agent-score.technical-moat.description'),
      details: [
        t('agent-score.technical-moat.ai-capability'),
        t('agent-score.technical-moat.data-flywheel'),
        t('agent-score.technical-moat.scalability')
      ]
    },
    {
      category: t('agent-score.business-health.title'),
      weight: "10%",
      weightValue: 10,
      score: 78,
      icon: DollarSign,
      description: t('agent-score.business-health.description'),
      details: [
        t('agent-score.business-health.unit-economics'),
        t('agent-score.business-health.cashflow')
      ]
    },
    {
      category: t('agent-score.execution-risk.title'),
      weight: "15%",
      weightValue: 15,
      score: 72,
      icon: AlertTriangle,
      description: t('agent-score.execution-risk.description'),
      details: [
        t('agent-score.execution-risk.team'),
        t('agent-score.execution-risk.resources'),
        t('agent-score.execution-risk.compliance')
      ]
    }
  ];

  const overallScore = Math.round(scoreBreakdown.reduce((acc, item) => 
    acc + (item.score * item.weightValue / 100), 0
  ));

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", className: "score-a-plus" };
    if (score >= 80) return { grade: "A", className: "score-a" };
    if (score >= 70) return { grade: "B+", className: "score-b-plus" };
    if (score >= 60) return { grade: "B", className: "score-b" };
    if (score >= 50) return { grade: "C+", className: "score-c-plus" };
    return { grade: "C", className: "score-c" };
  };

  const { grade, className } = getScoreGrade(overallScore);

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('agent-score.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('agent-score.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('agent-score.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Score Display */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                <div className="w-48 h-48 mx-auto lg:mx-0 rounded-full bg-gradient-primary flex items-center justify-center shadow-strong animate-glow-pulse">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">{overallScore}</div>
                    <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold mt-2 ${className}`}>
                      {grade}
                    </div>
                  </div>
                </div>
                <TrendingUp className="absolute -top-2 -right-2 w-8 h-8 text-accent animate-float" />
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold">综合评估结果</h3>
                <p className="text-muted-foreground">
                  基于当前数据分析，你的项目在创业生态中处于 <span className="font-semibold text-primary">{grade} 级</span> 水平，
                  建议投放预算为 <span className="font-semibold text-accent">$5,200/月</span>
                </p>
                <div className="flex gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">$5.2K</div>
                    <div className="text-sm text-muted-foreground">建议月预算</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">3.2x</div>
                    <div className="text-sm text-muted-foreground">预期ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">15%</div>
                    <div className="text-sm text-muted-foreground">增长潜力</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-6">
              {scoreBreakdown.map((item, index) => (
                <Card key={index} className="border-0 shadow-soft">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.category}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            权重 {item.weight}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{item.score}</div>
                        <div className="text-xs text-muted-foreground">/ 100</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Progress value={item.score} className="mb-3" />
                    <CardDescription className="mb-3">
                      {item.description}
                    </CardDescription>
                    <div className="space-y-1">
                      {item.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent"></div>
                          <span className="text-xs text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentScoreSection;