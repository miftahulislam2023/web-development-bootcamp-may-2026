"use client"

import { useState } from "react"
import {
  VideoTrack,
  AudioTrack,
  useTracks,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import { StreamStats } from "@/components/views/stream/StreamStats"
import { ReconnectionOverlay } from "@/components/views/stream/ReconnectionOverlay"
import { ChatPanel } from "@/components/views/stream/chat/ChatPanel"
import { ReactionBar } from "@/components/views/stream/reactions/ReactionBar"
import { ReactionOverlay } from "@/components/views/stream/reactions/ReactionOverlay"
import { useViewerCount } from "@/hooks/useViewerCount"
import { useReactions } from "@/hooks/useReactions"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, ChatText } from "@phosphor-icons/react"
import Link from "next/link"
import type { Room } from "@/lib/types/room"
import { cn } from "@/lib/utils"

interface ViewerStreamLayoutProps {
  room: Room
  guestChatEnabled: boolean
}

function ViewerStreamLayout({ room, guestChatEnabled }: ViewerStreamLayoutProps) {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone])
  const { viewerCount } = useViewerCount(room.roomKey)
  const { activeReactions, sendReaction, isCooldown } = useReactions({
    roomKey: room.roomKey,
  })

  const hostVideoTrack = tracks.find(
    (track) => track.source === Track.Source.Camera,
  )

  const hostAudioTrack = tracks.find(
    (track) => track.source === Track.Source.Microphone,
  )

  const [isChatOpen, setIsChatOpen] = useState(true)

  return (
    <main className="relative flex h-dvh w-full overflow-hidden bg-background text-foreground">
      {/* Video area */}
      <section className="absolute inset-0 z-0 flex flex-col">
        <ReconnectionOverlay />
        <ReactionOverlay reactions={activeReactions} />

        {/* Stream Video */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {hostVideoTrack ? (
            <VideoTrack
              trackRef={hostVideoTrack}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-muted/20">
              <Avatar className="size-24 ring-2 ring-border/50 shadow-xl">
                {room.hostAvatarUrl ? (
                  <AvatarImage src={room.hostAvatarUrl} alt={room.hostName} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-background/50 text-3xl font-bold uppercase text-muted-foreground">
                  {room.hostName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium uppercase tracking-widest text-foreground/70">
                Waiting for host…
              </p>
            </div>
          )}
          {hostAudioTrack && <AudioTrack trackRef={hostAudioTrack} />}
        </div>

        {/* Floating Header */}
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-linear-to-b from-background/80 to-transparent px-6 py-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 border border-border/20 text-foreground"
            >
              <Link href="/" aria-label="Leave stream">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div className="space-y-0.5">
              <h1 className="text-base font-bold tracking-tight text-foreground drop-shadow-md">
                {room.title}
              </h1>
              <div className="flex items-center gap-2">
                <div className="size-1.5 animate-pulse rounded-full bg-primary" />
                <p className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                  {room.hostName}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StreamStats isLive={true} viewerCount={viewerCount} />
          </div>
        </header>

        {/* Floating Footer — Reactions */}
        <footer className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-6 bg-linear-to-t from-background/90 via-background/40 to-transparent pb-10 pt-20">
          <ReactionBar onReaction={sendReaction} disabled={isCooldown} />
        </footer>
      </section>

      {/* Toggle Button */}
      <div 
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-30 transition-all duration-500",
          isChatOpen ? "translate-x-16 opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
        )}
        aria-hidden={isChatOpen}
      >
        <Button
          onClick={() => setIsChatOpen(true)}
          size="icon"
          aria-label="Open chat"
          tabIndex={isChatOpen ? -1 : 0}
          className="size-12 rounded-full bg-background/60 backdrop-blur-2xl border border-border/50 shadow-xl hover:bg-accent/80 text-foreground/80 hover:text-foreground transition-all hover:scale-105"
        >
          <ChatText className="size-5" weight="fill" />
        </Button>
      </div>

      {/* Chat Panel Overlay */}
      <ChatPanel
        roomKey={room.roomKey}
        hostName={room.hostName}
        isHost={false}
        guestChatEnabled={guestChatEnabled}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </main>
  )
}

export { ViewerStreamLayout }
