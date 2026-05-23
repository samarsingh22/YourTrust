'use client'

import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#F0DFA8',
          color: '#4A6444',
          border: '2px solid #4A6444',
          borderRadius: '0px',
          boxShadow: '4px 4px 0px #3A5235',
          fontFamily: 'inherit',
        },
        className: 'font-sonko-medium text-sm',
      }}
      {...props}
    />
  )
}

export { Toaster }
