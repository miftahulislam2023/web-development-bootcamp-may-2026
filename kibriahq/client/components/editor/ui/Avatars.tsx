import { DocAuthor } from '@/types/doc';
import { Store } from '@/store';
import { useStoreState } from 'easy-peasy';
import { LogOut, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Avatars = ({ permissions, handleRemovePermission, isAuthor, author }: { permissions: any[], handleRemovePermission: (id: string) => void, isAuthor: boolean, author: DocAuthor }) => {
    const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({});
    const { user } = useStoreState((state: Store) => state.auth);
    const router = useRouter();

    const handleMenuOpen = (id: string | number) => {
        setMenuOpen((prev) => ({
            [id]: !prev[id]
        }));
    }

    const removePermission = (id: string) => {
        handleRemovePermission(id);
        setMenuOpen((prev) => ({
            [id]: !prev[id]
        }));

        if (!isAuthor) {
            router.push(`/`);
        }
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-20 ${menuOpen[Object.keys(menuOpen)[0]] ? 'block' : 'hidden'}`}
                onClick={() => handleMenuOpen(Object.keys(menuOpen)[0])}
            />
            {!isAuthor && (
                <div className="relative z-30">
                    <div onClick={() => handleMenuOpen('x')} className={`w-10 h-10 rounded-full bg-${author.color}-200 flex items-center justify-center cursor-pointer`}>
                        <span className={`text-${author.color}-500 font-semibold text-xl`}>{author.name.charAt(0)}</span>
                    </div>

                    {menuOpen['x'] && (
                        <div className="flex items-center justify-between gap-2 absolute bg-slate-200 border-slate-500 z-40 top-11 -right-10 h-[70px] rounded p-2 px-3">
                            <div className="flex items-start flex-col">
                                <p className="text-slate-500 font-semibold text-md">{author.name}</p>
                                <span className="text-slate-500 font-body text-xs inline-block">(Owner)</span>
                                <p className="text-slate-500 font-body text-sm">{author.email}</p>
                            </div>
                        </div>
                    )}
                </div>)}

            {permissions.map((permission: any) => (
                <div key={permission.id} className="sm:relative z-30">
                    <div onClick={() => handleMenuOpen(permission.id)} className={`w-10 h-10 rounded-full bg-${permission.color}-200 flex items-center justify-center cursor-pointer`}>
                        <span className={`text-${permission.color}-500 font-semibold text-xl`}>{permission.name.charAt(0)}</span>
                    </div>

                    {menuOpen[permission.id] && (
                        <div className="flex items-center justify-between gap-2 absolute bg-slate-200 border-slate-500 z-40 mt-1 sm:top-10 left-0 sm:left-auto sm:-right-10 h-[50px] rounded p-2 px-3">
                            <div className="flex items-start flex-col">
                                <p className="text-slate-500 font-semibold text-md">{permission.name}</p>
                                <p className="text-slate-500 font-body text-sm">{permission.email}</p>
                            </div>
                            {isAuthor && (
                                <button onClick={() => removePermission(permission.id)} className="bg-red-200 text-red-500 hover:bg-red-300 p-1.5 rounded cursor-pointer">
                                    <Trash size={18} />
                                </button>
                            )}
                            {!isAuthor && user.id === permission.user_id && (
                                <button onClick={() => removePermission(permission.id)} className="bg-red-200 text-red-500 hover:bg-red-300 p-1.5 rounded cursor-pointer">
                                    <LogOut size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))
            }
        </>
    )
}

export default Avatars