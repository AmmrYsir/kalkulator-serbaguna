import { Component, createSignal, createEffect, onCleanup } from 'solid-js';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedNumber: Component<AnimatedNumberProps> = (props) => {
  const [displayValue, setDisplayValue] = createSignal(0);
  
  createEffect(() => {
    const targetValue = props.value;
    const startValue = displayValue();
    const duration = 600;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (targetValue - startValue) * easeOut;
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  });

  const formatted = () => {
    const val = displayValue();
    const formatted = val.toLocaleString('en-MY', {
      minimumFractionDigits: props.decimals || 0,
      maximumFractionDigits: props.decimals || 0,
    });
    return `${props.prefix || ''}${formatted}${props.suffix || ''}`;
  };

  return (
    <span class="tabular-nums">
      {formatted()}
    </span>
  );
};

export default AnimatedNumber;
