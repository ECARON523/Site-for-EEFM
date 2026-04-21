import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface TimerProps {
  initialMinutes: number;
  onClose: () => void;
}

export default function Timer({ initialMinutes, onClose }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      // Play sound or notification if possible
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Таймер завершен!', { body: 'Время вышло!' });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 bg-bg-surface rounded-3xl shadow-2xl border border-border-color p-6 w-64 animate-in slide-in-from-bottom-8 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-text-primary flex items-center gap-2">
          <Bell className={cn("w-4 h-4", isFinished ? "text-red-500 animate-bounce" : "text-primary")} />
          Таймер
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-bg-surface-light rounded-full transition-colors">
          <X className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      <div className={cn(
        "text-4xl font-black text-center mb-6 tabular-nums",
        isFinished ? "text-red-500 animate-pulse" : "text-text-primary"
      )}>
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-2">
        {!isFinished ? (
          <>
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex-1 bg-primary text-black font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isActive ? 'Пауза' : 'Старт'}
            </button>
            <button
              onClick={() => setTimeLeft(initialMinutes * 60)}
              className="p-2 border border-border-color rounded-xl hover:bg-bg-surface-light transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-text-muted" />
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setIsFinished(false);
              setTimeLeft(initialMinutes * 60);
              setIsActive(true);
            }}
            className="w-full bg-bg-surface-light text-text-primary font-bold py-2 rounded-xl hover:bg-border-color transition-colors"
          >
            Повторить
          </button>
        )}
      </div>
    </div>
  );
}
