interface HostPageProps {
  params: Promise<{ roomKey: string }>
}

export default async function HostPage(props: HostPageProps) {
  const { roomKey } = await props.params

  // Dynamic import — LiveKit components are heavy, lazy-load to avoid bloating the main bundle
  const { HostView } = await import(
    "@/components/views/stream/HostView"
  )

  return <HostView roomKey={roomKey} />
}
