import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Декодирование сигналов ЭЭГ",
    description: "Собственные алгоритмы расшифровки нейросигналов в реальном времени с адаптацией к индивидуальным паттернам мозга.",
    icon: "brain",
    badge: "Core",
  },
  {
    title: "Приватность данных",
    description: "Все нейроданные обрабатываются локально — ничего не покидает устройство без явного разрешения.",
    icon: "lock",
    badge: "Local",
  },
  {
    title: "Управление мыслью",
    description: "Перевод намерений пользователя в команды для внешних систем с задержкой менее миллисекунды.",
    icon: "globe",
    badge: "< 1ms",
  },
  {
    title: "Самообучающаяся модель",
    description: "Нейросеть адаптируется к паттернам конкретного пользователя, повышая точность с каждой сессией.",
    icon: "zap",
    badge: "ML",
  },
  {
    title: "Биосинхронизация",
    description: "Интеграция с биометрическими датчиками — ЧСС, КГР и ЭМГ — для контекстуального управления.",
    icon: "link",
    badge: "Bio",
  },
  {
    title: "Открытый API",
    description: "Стандартный интерфейс для подключения сторонних устройств, игровых движков и XR-платформ.",
    icon: "target",
    badge: "Open",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Что умеет мой интерфейс</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Исследую границы связи между мозгом и машиной — вот ключевые направления моей разработки
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">
                    {feature.icon === "brain" && "&#129504;"}
                    {feature.icon === "lock" && "&#128274;"}
                    {feature.icon === "globe" && "&#127760;"}
                    {feature.icon === "zap" && "&#9889;"}
                    {feature.icon === "link" && "&#128279;"}
                    {feature.icon === "target" && "&#127919;"}
                  </span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}