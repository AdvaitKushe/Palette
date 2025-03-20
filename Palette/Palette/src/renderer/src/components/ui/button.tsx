import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

export const Button = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-medium inline-flex items-center justify-center rounded-md'

  const variantStyles = {
    default: 'bg-primary hover:bg-primary/90 text-white',
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white'
  }

  const sizeStyles = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6'
  }

  return (
    <button
      className={twMerge(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
