import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { StudySubject, StudyChapter, StudyPart } from "@/hooks/useStudy";
import { useMemo } from "react";

interface StudyAnalyticsProps {
    subjects: StudySubject[];
    chapters: StudyChapter[];
    parts: StudyPart[];
    chaptersBySubject: Record<string, StudyChapter[]>;
    partsByChapter: Record<string, StudyPart[]>;
    subjectProgress: Record<string, number>;
}

export function StudyAnalytics({ subjects, parts, subjectProgress }: StudyAnalyticsProps) {
    const data = useMemo(() => {
        const barData = subjects.map(s => ({
            name: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
            progress: subjectProgress[s.id] || 0,
        }));

        const statusData = [
            { name: "Completed", value: parts.filter(p => p.status === "completed").length, color: "#22c55e" },
            { name: "In Progress", value: parts.filter(p => p.status === "in-progress").length, color: "#3b82f6" },
            { name: "Not Started", value: parts.filter(p => p.status === "not-started").length, color: "#94a3b8" },
        ].filter(d => d.value > 0);

        return { barData, statusData };
    }, [subjects, parts, subjectProgress]);

    if (subjects.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            <div className="glass-card p-4">
                <h3 className="font-semibold mb-4">Subject Progress</h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.barData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid #8b5cf6', boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Progress %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card p-4">
                <h3 className="font-semibold mb-4">Parts Distribution</h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid #8b5cf6', boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
