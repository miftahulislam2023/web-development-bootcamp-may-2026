import React from 'react'
import { Doc } from '@/types/doc'
import Link from 'next/link'
import { timeFormater } from '@/utils/timeFormater'

type Props = {
    docs: Doc[],
    title: string,
    icon: React.ReactNode,
    iconBg: string
}

const DocList = ({ docs, title, icon, iconBg }: Props) => {
    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                <div className={`p-2 rounded-xl ${iconBg === 'amber' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
                    {icon}
                </div>
                {title}
            </h2>
            <div className="grid gap-3">
                {docs.map((doc) => (
                    <Link
                        key={doc.id}
                        href={`/docs/${doc.id}`}
                        className="group p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200"
                    >
                        <div className="font-semibold text-slate-700 group-hover:text-indigo-700">
                            {doc.name}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Last updated: {timeFormater(doc.updated_at)}</div>
                    </Link>
                ))}

                {docs.length === 0 && (
                    <p className="text-slate-400 py-8 text-center">No documents found</p>
                )}
            </div>
        </section>
    )
}

export default DocList