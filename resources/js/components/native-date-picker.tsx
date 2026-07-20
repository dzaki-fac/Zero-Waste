import { useRef } from 'react';
import { CalendarDays } from 'lucide-react';

type NativeDatePickerProps = {
    value: string;
    onChange: (value: string) => void;
    className?: string;
};

export default function NativeDatePicker({ value, onChange, className = '' }: NativeDatePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const openDatePicker = () => {
        const input = inputRef.current;
        if (!input) return;
        try {
            input.showPicker?.();
        } catch {
            input.focus();
            input.click();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={openDatePicker}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openDatePicker();
                }
            }}
            className={`relative cursor-pointer ${className}`}
        >
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-green-500" />
            <input
                ref={inputRef}
                type="date"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onClick={(event) => {
                    event.stopPropagation();
                    try {
                        event.currentTarget.showPicker?.();
                    } catch {
                        event.currentTarget.focus();
                    }
                }}
                className="h-9 w-full cursor-pointer rounded-md border border-green-200 bg-white pl-11 pr-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
        </div>
    );
}
