import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Layout from "../components/Layout"

export default function ViewPost() {
  const { postId } = useParams()
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
      <div className="max-w-4xl mx-auto px-8 py-20">
        <p className="text-neutral-500">Loading...</p>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-8 py-20">
        {/* Header */}
        <header className="mb-20">
          <h1 className="text-6xl font-light text-neutral-900 mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-8 text-neutral-500 text-sm mb-12">
            <time>
              {post.createdAt?.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            {post.tags?.length > 0 && (
              <div className="flex gap-3">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-neutral-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Hero image placeholder */}
          <div className="aspect-[16/9] bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 rounded-lg mb-16"></div>
        </header>
        
        {/* Content */}
        <div className="prose prose-xl max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({children}) => <h1 className="text-4xl font-light text-neutral-900 mb-8 mt-16 leading-tight">{children}</h1>,
              h2: ({children}) => <h2 className="text-3xl font-light text-neutral-900 mb-6 mt-12 leading-tight">{children}</h2>,
              h3: ({children}) => <h3 className="text-2xl font-light text-neutral-900 mb-4 mt-10 leading-tight">{children}</h3>,
              p: ({children}) => <p className="text-neutral-700 leading-relaxed mb-8 text-xl">{children}</p>,
              blockquote: ({children}) => (
                <blockquote className="border-l-2 border-neutral-300 pl-8 my-12 text-neutral-600 italic text-xl">
                  {children}
                </blockquote>
              ),
              code: ({children}) => (
                <code className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-base">
                  {children}
                </code>
              ),
              pre: ({children}) => (
                <pre className="bg-neutral-100 p-8 rounded-lg overflow-x-auto my-12 text-base">
                  {children}
                </pre>
              ),
              img: ({src, alt}) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-full rounded-lg my-12"
                />
              ),
              ul: ({children}) => <ul className="text-neutral-700 mb-8 space-y-3 text-xl">{children}</ul>,
              ol: ({children}) => <ol className="text-neutral-700 mb-8 space-y-3 text-xl">{children}</ol>,
              li: ({children}) => <li className="leading-relaxed">{children}</li>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        
        {/* Footer */}
        <div className="border-t border-neutral-200 mt-20 pt-12">
          <p className="text-neutral-500 text-sm">
            Published on {post.createdAt?.toDate().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </article>
    </Layout>
  )
}