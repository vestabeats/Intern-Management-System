import React from 'react'
import clsx from 'clsx'
const Button = ({icon,type,label,className,onClick=()=>{}}) => {
  return (
    
    <button type={type || 'button'} className={clsx("px-3 py-2 outline-none rounded-full",className)} onClick={onClick}>
        <span>{label}</span>
        {icon && icon}
    </button>
  )
}

export default Button