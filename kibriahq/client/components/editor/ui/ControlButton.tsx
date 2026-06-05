import { ReactNode } from "react"

type Props = {
    onClick?: () => any,
    className?: string,
    disabled?: false | boolean,
    isActive?: boolean,
    children: ReactNode,
    title?: string,
}

export default function ControlButton({ onClick, className, disabled, isActive, children, title }: Props) {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`p-1 bg-slate-50 hover:bg-slate-800 hover:text-slate-100 mx-1 cursor-pointer rounded transition-all ${className} ${isActive ? "bg-slate-700 text-slate-200" : ""}`}
        >
            {children}
        </button>
    )
}