import EditorWrapper from './EditorWrapper'

export default async function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main className="container mx-auto">
      <EditorWrapper roomName={id} />
    </main>
  )
}