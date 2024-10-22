

type Props = {
    children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
    return (
        <main className="w-screen md:w-full">
            {children}
        </main>
    )
}

export default AdminLayout;