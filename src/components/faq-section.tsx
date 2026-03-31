import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Нужен ли имплант для работы с системой?",
      answer:
        "Нет. Текущая версия проекта работает с неинвазивными ЭЭГ-гарнитурами — никакой хирургии не требуется. Я исследую как потребительские устройства (Muse, OpenBCI), так и профессиональное оборудование.",
    },
    {
      question: "Какое оборудование нужно для подключения?",
      answer:
        "Поддерживаются OpenBCI Cyton, Muse 2/S, Emotiv EPOC и другие популярные ЭЭГ-гарнитуры. Система работает через Bluetooth или USB без дополнительных драйверов.",
    },
    {
      question: "Как данные моего мозга защищены?",
      answer:
        "Вся обработка нейросигналов происходит локально на устройстве пользователя. Никакие данные не передаются на внешние серверы без явного согласия.",
    },
    {
      question: "Какова точность распознавания намерений?",
      answer:
        "На базовых командах (направление взгляда, концентрация/расслабление) точность достигает 94-97% после калибровки. Более сложные паттерны — в активной разработке.",
    },
    {
      question: "Можно ли использовать проект в коммерческих целях?",
      answer:
        "Это личный исследовательский проект. Если вас интересует сотрудничество или лицензирование — свяжитесь со мной напрямую, готов обсудить.",
    },
    {
      question: "На каком этапе разработка?",
      answer:
        "Проект активно развивается. Базовый декодер сигналов и управление мышью работают стабильно. Сейчас я работаю над улучшением адаптивной калибровки и поддержкой большего числа устройств.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Отвечаю на вопросы об устройстве, безопасности и текущем состоянии проекта.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-red-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-red-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}