import Link from 'next/link'

const GoHomeBtn = () => {
    return (
        <Link href="/" className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-100 text-gray-900 shadow-md border border-gray-500 shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none w-full md:w-36" type="button">
            Go to Home
        </Link>
    )
}

export default GoHomeBtn