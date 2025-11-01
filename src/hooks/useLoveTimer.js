import { useEffect, useState } from "react";

export default function useLoveTimer(startDate) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diff = now - start;
      
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const totalMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const totalSeconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDays(totalDays);
      setHours(totalHours);
      setMinutes(totalMinutes);
      setSeconds(totalSeconds);
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return { days, hours, minutes, seconds };
}