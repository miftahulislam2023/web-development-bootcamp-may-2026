import { useEffect, useState } from "react"
import { createDoc, getMyDocs, getSharedDocs } from "@/api/doc"
import { useRouter } from "next/navigation"
import { Doc } from "@/types/doc";
import { toast } from "sonner"

const useHome = () => {
    const [docs, setDocs] = useState<Doc[]>([])
    const [shareDocs, setShareDocs] = useState<Doc[]>([])

    const router = useRouter();

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const docs = await getMyDocs();
                setDocs(docs);
            } catch (error: any) {
                toast.error(error?.response.data.msg)
            }
        }
        fetchDocs();
    }, [])

    useEffect(() => {
        const fetchSharedDocs = async () => {
            try {
                const docs = await getSharedDocs();
                setShareDocs(docs);
            } catch (error: any) {
                toast.error(error?.response.data.msg)
            }
        }
        fetchSharedDocs();
    }, [])

    const createNewDoc = async () => {
        try {
            const d = await createDoc();
            setDocs(prev => [...prev, d]);
            router.push(`/docs/${d.id}`);
            toast.success("Document created successfully");
        } catch (error: any) {
            toast.error(error?.response.data.msg)
        }
    }

    return {
        docs,
        shareDocs,
        createNewDoc
    }
}

export default useHome