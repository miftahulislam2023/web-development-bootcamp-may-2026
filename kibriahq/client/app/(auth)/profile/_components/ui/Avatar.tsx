import type { Profile } from "@/types/user";

const Avatar = ({ profile }: { profile: Profile }) => {
    return (
        <div className="w-20 h-15 relative">
            <div className={`absolute bottom-0 w-20 h-20 rounded-full bg-${profile.color}-200 flex items-center justify-center cursor-pointer`}>
                <span className={`text-${profile.color}-500 font-semibold text-4xl`}>{profile.name.charAt(0)}</span>
            </div>
        </div>
    )
}

export default Avatar