import { StreamSummaryView } from "@/components/views/dashboard/StreamSummaryView"

interface StreamSummaryPageProps {
  params: Promise<{
    roomKey: string
    sessionId: string
  }>
}

export default async function StreamSummaryPage({ params }: StreamSummaryPageProps) {
  const { roomKey, sessionId } = await params

  return <StreamSummaryView roomKey={roomKey} sessionId={sessionId} />
}
