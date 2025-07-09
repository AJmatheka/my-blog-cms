import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Layout from "../components/Layout"

export default function ViewPost() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<any>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const docRef = doc(db, "posts", postId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) setPost(docSnap.data())
      }
    }
    fetchPost()
  }, [postId])

  if (!post) return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-dark-700 rounded-full mx-auto mb-8 flex items-center justify-center animate-pulse">
            <span className="text-2xl">📖</span>
          </div>
          <p className="text-neutral-400 text-xl">Loading story...</p>
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <article className="max-w-5xl mx-auto px-6 py-12">
        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-orange rounded-full"></div>
              <div className="w-3 h-3 bg-accent-red rounded-full"></div>
            </div>
            <span className="text-accent-orange text-sm font-semibold uppercase tracking-wider">
              Featured Article
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-8 text-neutral-400">
              <time className="text-lg">
                {post.createdAt?.toDate().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {post.tags?.length > 0 && (
                <div className="flex gap-3">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-accent-orange font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span> Back to Stories
            </button>
          </div>
          
          {/* Hero image placeholder */}
          <div className="aspect-[21/9] bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-600 rounded-lg mb-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <span className="bg-accent-orange text-white text-sm px-3 py-1 rounded font-medium">
                Featured Image
              </span>
            </div>
          </div>
        </header>
        
        {/* Article Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <div className="prose prose-xl max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-4xl font-display font-bold text-white mb-8 mt-16 leading-tight">{children}</h1>,
                  h2: ({children}) => <h2 className="text-3xl font-display font-bold text-white mb-6 mt-12 leading-tight">{children}</h2>,
                  h3: ({children}) => <h3 className="text-2xl font-display font-bold text-white mb-4 mt-10 leading-tight">{children}</h3>,
                  p: ({children}) => <p className="text-neutral-200 leading-relaxed mb-8 text-xl">{children}</p>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-accent-orange pl-8 my-12 text-neutral-300 italic text-xl bg-dark-800/50 py-6 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({children}) => (
                    <code className="bg-dark-700 text-accent-orange px-3 py-1 rounded text-base font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({children}) => (
                    <pre className="bg-dark-800 border border-dark-600 p-8 rounded-lg overflow-x-auto my-12 text-base">
                      {children}
                    </pre>
                  ),
                  img: ({src, alt}) => (
                    <img 
                      src={src} 
                      alt={alt} 
                      className="w-full rounded-lg my-12 border border-dark-600"
                    />
                  ),
                  ul: ({children}) => <ul className="text-neutral-200 mb-8 space-y-3 text-xl list-disc list-inside">{children}</ul>,
                  ol: ({children}) => <ol className="text-neutral-200 mb-8 space-y-3 text-xl list-decimal list-inside">{children}</ol>,
                  li: ({children}) => <li className="leading-relaxed">{children}</li>,
                  a: ({href, children}) => (
                    <a href={href} className="text-accent-orange hover:text-accent-orange/80 transition-colors underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="magazine-card p-6 sticky top-24">
              <h3 className="text-white font-display font-bold text-xl mb-4">
                Story Details
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-neutral-400 block mb-1">Published</span>
                  <span className="text-white">
                    {post.createdAt?.toDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                {post.tags?.length > 0 && (
                  <div>
                    <span className="text-neutral-400 block mb-2">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <span key={tag} className="bg-accent-orange/20 text-accent-orange px-2 py-1 rounded text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-dark-600">
                  <button
                    onClick={() => navigate(`/editor/${postId}`)}
                    className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Edit Story
                  </button>
                </div>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="magazine-card p-6">
              <h3 className="text-white font-display font-bold text-xl mb-4">
                Stay Updated
              </h3>
              <p className="text-neutral-400 text-sm mb-4">
                Get notified when new stories are published.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full magazine-input text-sm"
                />
                <button className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Footer */}
        <footer className="border-t border-dark-700 mt-20 pt-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm mb-2">
                Published on {post.createdAt?.toDate().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-neutral-500 text-xs">
                Part of The Canvas collection
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-neutral-400 text-sm">Share:</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-dark-700 hover:bg-accent-orange rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-xs">f</span>
                </button>
                <button className="w-8 h-8 bg-dark-700 hover:bg-accent-red rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-xs">t</span>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </Layout>
  )
}