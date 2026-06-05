import LogoutBtn from './ui/LogoutBtn'
import EditBtn from './ui/EditBtn'
import type { Profile } from '@/types/user'
import Avatar from './ui/Avatar'

type Props = {
    profile: Profile,
    handleLogout: () => void,
    setIsEditing: (value: boolean) => void
}

const Header = ({ profile, handleLogout, setIsEditing }: Props) => {
    return (
        <>
            <div className={`bg-linear-to-r from-${profile.color}-500 to-${profile.color}-400 px-6 py-12`}>
            </div>

            <div className="bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center px-7">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 pb-2 sm:pb-5 pt-1 w-full">
                    <Avatar profile={profile} />
                    <div className="py-2">
                        <h2 className="text-xl sm:text-2xl text-center sm:text-left font-bold text-slate-700">{profile.name}</h2>
                        <p className="text-center sm:text-left text-slate-500">{profile.email}</p>
                    </div>
                </div>

                <div className="flex gap-2 pb-2 w-full justify-center sm:justify-end">
                    <LogoutBtn onClick={handleLogout} />
                    <EditBtn onClick={() => setIsEditing(true)} />
                </div>
            </div>
        </>
    )
}

export default Header