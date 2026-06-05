const ErrorTitle = ({ title }: { title: string }) => {
    return (
        <h1 className="block antialiased tracking-normal font-sans text-4xl font-semibold leading-tight text-blue-gray-900 mt-5 lg:text-5xl">
            {title}
        </h1>
    )
}

export default ErrorTitle