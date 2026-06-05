import useAddPermission from "@/hooks/useAddPermission";
import { Check, Plus } from "lucide-react";

const AddUser = ({ docId, handleUpdatePermissions }: { docId: string, handleUpdatePermissions: () => void }) => {
    const {
        input,
        isAddUserOpen,
        users,
        handleSearch,
        handleAddUser,
        handleAddPermission,
    } = useAddPermission({ docId, handleUpdatePermissions })

    return (
        <>
            <div
                className={`fixed inset-0 z-40 ${isAddUserOpen ? 'block' : 'hidden'}`}
                onClick={handleAddUser}
            />
            <div className="sm:relative group">
                <div onClick={handleAddUser} className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center cursor-pointer border-dashed border-2 border-slate-400">
                    <span className="text-slate-500 hover:text-slate-600 font-semibold text-xl">
                        <Plus />
                    </span>
                </div>
                <div className={`absolute mt-1 sm:top-10 left-0 sm:left-auto sm:right-0 w-full sm:w-[250px] h-[350px] sm:h-[300px] bg-slate-100 rounded-full z-40 border border-slate-300 p-2 px-2 ${isAddUserOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col items-center justify-start h-full">
                        <div className="px-2 py-2 w-full">
                            <input value={input} onChange={handleSearch} type="text" className="border border-slate-200 rounded p-2 mt-2 w-full text-slate-500 focus:outline-none focus:border-slate-300" placeholder="Search by email..." />
                        </div>

                        {users.length > 0 ? (
                            <div className="flex flex-col items-center justify-center mt-4 gap-2 w-full px-4 overflow-y-auto">
                                {/* user items */}
                                {users.map((user: any) => (
                                    <div key={user.id} className="flex items-center justify-between gap-2 w-full">
                                        <div className="flex items-start flex-col">
                                            <p className="text-slate-500 font-semibold text-md">{user.name}</p>
                                            <p className="text-slate-500 font-body text-sm">{user.email}</p>
                                        </div>
                                        {user.isAdded ? (
                                            <button className="bg-slate-200 text-slate-500 p-1 rounded">
                                                <Check size={20} />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleAddPermission(user.id)} className="bg-green-200 text-green-500 hover:bg-green-300 p-1 rounded cursor-pointer">
                                                <Plus size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 w-full h-full grow">
                                <p className="text-slate-500 font-medium text-md my-auto">No user found!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUser