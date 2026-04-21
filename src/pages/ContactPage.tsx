import { Mail, Phone, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const email = 'roysemeconi890@gmail.com';
  const phone = '+79935198031';

  const mailServices = [
    { name: 'Gmail', url: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, color: 'bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-900/30' },
    { name: 'Mail.ru', url: `https://e.mail.ru/compose/?to=${email}`, color: 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 border border-blue-900/30' },
    { name: 'Яндекс Почта', url: `https://mail.yandex.ru/compose?to=${email}`, color: 'bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/30 border border-yellow-900/30' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-surface rounded-3xl shadow-sm border border-border-color overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-text-primary mb-6">Написать нам</h1>
          
          <div className="prose prose-lg text-text-muted mb-12">
            <p className="text-xl leading-relaxed">
              Мы всегда открыты для ваших идей, предложений и отзывов! Ваше мнение помогает нам становиться лучше и создавать проект, который вдохновляет на кулинарные подвиги каждый день. 
            </p>
            <p>
              Если у вас есть вопросы по работе сайта, предложения по сотрудничеству или вы просто хотите поделиться своим любимым рецептом — не стесняйтесь, пишите нам! Мы читаем каждое сообщение и стараемся отвечать как можно быстрее.
            </p>
            <p className="font-medium text-primary">
              Давайте вместе сделаем мир вкуснее!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex items-start gap-4 p-6 bg-bg-surface-light rounded-2xl border border-border-color">
              <div className="w-12 h-12 bg-bg-surface rounded-xl flex items-center justify-center shadow-sm border border-border-color">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Телефон для связи</p>
                <a href={`tel:${phone}`} className="text-xl font-bold text-text-primary hover:text-primary transition-colors">
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-bg-surface-light rounded-2xl border border-border-color">
              <div className="w-12 h-12 bg-bg-surface rounded-xl flex items-center justify-center shadow-sm border border-border-color">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Электронная почта</p>
                <a href={`mailto:${email}`} className="text-xl font-bold text-text-primary hover:text-primary transition-colors block mb-2">
                  {email}
                </a>
                <a href="https://web.telegram.org/k/#@nigerofficial" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  Написать в Telegram
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">Написать через почтовый сервис:</h3>
            <div className="flex flex-wrap gap-4">
              {mailServices.map((service) => (
                <a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${service.color}`}
                >
                  {service.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
