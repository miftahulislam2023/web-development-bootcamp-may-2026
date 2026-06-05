const ErrorMsg = ({ msg }: { msg: string }) => {
    return (
        <p className="block antialiased font-sans text-xl font-normal leading-relaxed text-gray-700 mt-4 mb-6 w-full md:max-w-full lg:mb-8 lg:max-w-3xl">
            {msg}
        </p>
    )
}

export default ErrorMsg