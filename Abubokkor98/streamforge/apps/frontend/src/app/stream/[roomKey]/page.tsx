  const { ViewerView } = await import(
    "@/components/views/stream/ViewerView"
  )

interface ViewerPageProps {
  params: Promise<{ roomKey: string }>
}

export default async function ViewerPage(props: ViewerPageProps) {
  const { roomKey } = await props.params



  return <ViewerView roomKey={roomKey} />
}
