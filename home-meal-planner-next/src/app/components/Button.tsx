'use client'
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { useTheme } from './ThemeProvider'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  className?: string
  icon?: ReactNode
  rounded?: boolean
  showTextOnMobile?: boolean
}

const themeStyles: Record<string, Record<ButtonVariant, string>> = {
  white: {
    primary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    outline: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 border border-transparent',
  },
  dark: {
    primary: 'bg-[#222] text-white border border-white hover:bg-[#333]',
    secondary: 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700',
    outline: 'bg-transparent text-white border border-white hover:bg-gray-800',
    ghost: 'bg-transparent text-white border border-transparent hover:bg-gray-800',
  },
  pink: {
    primary: 'bg-pink-200 text-[#ad1457] border border-pink-400 hover:bg-pink-300',
    secondary: 'bg-white text-[#ad1457] border border-pink-200 hover:bg-pink-50',
    outline: 'bg-white text-[#ad1457] border border-pink-400 hover:bg-pink-50',
    ghost: 'bg-transparent text-[#ad1457] border border-transparent hover:bg-pink-50',
  },
  green: {
    primary: 'bg-green-100 text-[#065f46] border border-green-400 hover:bg-green-200',
    secondary: 'bg-white text-[#065f46] border border-green-200 hover:bg-green-50',
    outline: 'bg-white text-[#065f46] border border-green-400 hover:bg-green-50',
    ghost: 'bg-transparent text-[#065f46] border border-transparent hover:bg-green-50',
  },
  sky: {
    primary: 'bg-sky-200 text-[#0369a1] border border-sky-400 hover:bg-sky-300',
    secondary: 'bg-white text-[#0369a1] border border-sky-200 hover:bg-sky-50',
    outline: 'bg-white text-[#0369a1] border border-sky-400 hover:bg-sky-50',
    ghost: 'bg-transparent text-[#0369a1] border border-transparent hover:bg-sky-50',
  },
  rainbow: {
    primary: 'bg-white text-[#b45309] border border-yellow-400 hover:bg-yellow-50',
    secondary: 'bg-white text-[#b45309] border border-yellow-200 hover:bg-yellow-50',
    outline: 'bg-white text-[#b45309] border border-yellow-400 hover:bg-yellow-50',
    ghost: 'bg-transparent text-[#b45309] border border-transparent hover:bg-yellow-50',
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      className = '',
      disabled,
      icon,
      showTextOnMobile = false,
      rounded = false,
      children,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()
    const themeClass = themeStyles[theme]?.[variant] || themeStyles['white'][variant]
    return (
      <button
        ref={ref}
        className={`rounded font-semibold transition text-sm sm:text-base shadow ${themeClass} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }${rounded ? 'rounded-full p-0 sm:rounded scale-150 w-9 h-9 pt-1 mx-2' : 'px-3 py-1'} ${className}`}
        disabled={disabled}
        {...props}
      >
        {icon ? (
          <>
            <span className={showTextOnMobile ? 'inline-flex items-center gap-2' : 'inline-flex items-center gap-2'}>
              <span className={showTextOnMobile ? '' : 'sm:mr-2'}>{icon}</span>
              {/* On mobile, only icon unless showTextOnMobile is true */}
              <span className={showTextOnMobile ? '' : 'hidden sm:inline'}>{children}</span>
            </span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
