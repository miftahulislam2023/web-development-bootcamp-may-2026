'use client'

import { getDoc } from "@/api/doc";
import { Doc } from "@/types/doc";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

const Editor = dynamic(() => import('@/components/editor/Editor'), {
    ssr: false,
    loading: () => <Loader />,
});

export default function EditorWrapper({ roomName }: { roomName: string }) {
    const [doc, setDoc] = useState<Doc | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const data = await getDoc(roomName);
                setDoc(data);
            } catch (error: any) {
                toast.error(error?.response?.data?.msg);

                if (error?.response?.status === 403) {
                    router.push('/');
                } else if (error?.response?.status === 404) {
                    router.replace(`/404?msg=${error?.response?.data?.msg}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDoc();
    }, [roomName]);

    if (loading) return <Loader />;
    if (!doc) return null;

    return <Editor roomName={roomName} doc={doc} />;
}