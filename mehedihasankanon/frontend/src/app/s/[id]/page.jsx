'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { Header } from '@/components/header'
import { FileIcon, ImageIcon, VideoIcon, FileTextIcon, FileArchiveIcon, Eye, Download, FileAudioIcon } from 'lucide-react'

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-zinc-800 bg-black text-white shadow-sm ${className}`}>
    {children}
  </div>
)

const Button = ({ children, onClick, disabled, className = "", as = "button", href, target, rel, download }) => {
  const Component = as;
  return (
    <Component
      onClick={onClick}
      disabled={disabled}
      href={href}
      target={target}
      rel={rel}
      download={download}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 border border-zinc-800 hover:bg-zinc-800 hover:text-white h-10 px-4 py-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] ${className}`}
    >
      {children}
    </Component>
  )
}

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-md border border-zinc-800 px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
    {children}
  </span>
)

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const getFileIcon = (type) => {
  if (!type) return <FileIcon className="h-10 w-10 text-zinc-400" />;
  if (type.startsWith('image/')) return <ImageIcon className="h-10 w-10 text-zinc-400" />;
  if (type.startsWith('video/')) return <VideoIcon className="h-10 w-10 text-zinc-400" />;
  if (type.startsWith('audio/')) return <FileAudioIcon className="h-10 w-10 text-zinc-400" />;
  if (type.startsWith('text/')) return <FileTextIcon className="h-10 w-10 text-zinc-400" />;
  if (type.includes('pdf')) return <FileTextIcon className="h-10 w-10 text-zinc-400" />;
  if (type.includes('zip') || type.includes('compressed')) return <FileArchiveIcon className="h-10 w-10 text-zinc-400" />;
  return <FileIcon className="h-10 w-10 text-zinc-400" />;
}

const canViewInBrowser = (type) => {
  if (!type) return false;
  return type.startsWith('image/') || type.startsWith('video/') || type.startsWith('text/') || type.includes('pdf') || type.startsWith('audio/');
}

export default function SharePage() {
  const { id } = useParams()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return;

    const fetchFile = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/files/share/${id}`);
        setFile(response.data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.response && err.response.status === 404) {
          setError('Stash not found.');
        } else if (err.response && err.response.status === 403) {
          setError('This stash is private or the link has changed.');
        } else {
          setError('An error occurred while fetching the stash.');
        }
      } finally {
        setLoading(false)
      }
    }

    fetchFile();
  }, [id])

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex items-center justify-center pt-24 px-4">
        {loading ? (
          <div className="text-zinc-500 animate-pulse">Loading stash...</div>
        ) : error ? (
          <Card className="w-full max-w-md p-8 text-center border-red-900/50 bg-red-950/10">
            <h2 className="text-xl font-semibold mb-2">Access Error</h2>
            <p className="text-zinc-500">{error}</p>
          </Card>
        ) : file ? (
          <div className="w-full max-w-md space-y-6">
            {file.isOwner && file.access === 'PRIVATE' && (
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300">
                This file is in your private stash. To share it, go to your dashboard and make it public.
              </div>
            )}
            <Card className="p-8">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                  This file was shared with you:
                </p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                  {getFileIcon(file.type)}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold truncate max-w-[250px] mb-1" title={file.name}>
                    {file.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                    <Badge className="bg-zinc-900 text-zinc-400 border-zinc-800 font-normal">
                      {formatBytes(file.size)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  as="a" 
                  href={canViewInBrowser(file.type) ? file.url : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full gap-2 ${!canViewInBrowser(file.type) ? 'opacity-50 pointer-events-none' : ''}`}
                  disabled={!canViewInBrowser(file.type)}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                
                <Button 
                  as="a" 
                  href={file.url}
                  download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full gap-2 bg-white text-black hover:bg-zinc-200 hover:text-black border-transparent"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </Card>

            <div className="text-center pt-4">
              <p className="text-zinc-500 text-sm tracking-tighter">
                Wanna stash and share your own files?{' '}
                <a 
                  href="/" 
                  className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors"
                >
                  Join fylestash now.
                </a>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
