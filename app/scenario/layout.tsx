
type Props = {
    children: React.ReactNode
}

const ScenarioLayout = ({ children }: Props) => {
    return (
        <main className="h-full w-screen md:w-full">
            {children}
        </main>
    )
}

export default ScenarioLayout;