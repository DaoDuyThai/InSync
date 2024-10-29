
type Props = {
    children: React.ReactNode
}

const LogLayout = ({ children }: Props) => {
    return (
        <main className="h-screen w-screen overflow-hidden">
            {children}
        </main>
    );
}

export default LogLayout;