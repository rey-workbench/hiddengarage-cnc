import { InputHTMLAttributes, forwardRef } from 'react';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  unit?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      showValue = true,
      unit = '',
      value,
      min = 0,
      max = 100,
      step = 1,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">{label}</label>
            {showValue && (
              <span className="text-[10px] text-primary-400 font-semibold">
                {value}{unit}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          className={`
            w-full h-1.5 rounded-lg appearance-none cursor-pointer
            bg-gradient-to-r from-dark-800 to-dark-700
            shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]
            border border-dark-600/50
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-gradient-to-br
            [&::-webkit-slider-thumb]:from-primary-400
            [&::-webkit-slider-thumb]:to-primary-600
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-primary-300/50
            [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(59,130,246,0.5)]
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_16px_rgba(59,130,246,0.7)]
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-300
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-gradient-to-br
            [&::-moz-range-thumb]:from-primary-400
            [&::-moz-range-thumb]:to-primary-600
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-primary-300/50
            [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(59,130,246,0.5)]
            [&::-moz-range-thumb]:hover:shadow-[0_0_16px_rgba(59,130,246,0.7)]
            [&::-moz-range-thumb]:hover:scale-110
            [&::-moz-range-thumb]:transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
