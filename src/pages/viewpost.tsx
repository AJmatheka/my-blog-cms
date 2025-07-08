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

  if (!post) return <p className="p-10">Loading...</p>

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl font-serif text-reseda_green-100 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sage-400 text-sm">
            <time>
              {post.createdAt?.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            {post.tags?.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-buff-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
        
        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({children}) => <h1 className="text-3xl font-serif text-reseda_green-100 mb-6 mt-12">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl font-serif text-reseda_green-100 mb-4 mt-10">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-serif text-reseda_green-100 mb-3 mt-8">{children}</h3>,
              p: ({children}) => <p className="text-sage-200 leading-relaxed mb-6 text-lg">{children}</p>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-buff-400 pl-6 my-8 text-sage-300 italic">
                  {children}
                </blockquote>
              ),
              code: ({children}) => (
                <code className="bg-champagne_pink-800/30 text-buff-300 px-2 py-1 rounded text-sm">
                  {children}
                </code>
              ),
              pre: ({children}) => (
                <pre className="bg-champagne_pink-800/30 p-6 rounded-lg overflow-x-auto my-6">
                  {children}
                </pre>
              ),
              img: ({src, alt}) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-full rounded-lg my-8 shadow-lg"
                />
              ),
              ul: ({children}) => <ul className="text-sage-200 mb-6 space-y-2">{children}</ul>,
              ol: ({children}) => <ol className="text-sage-200 mb-6 space-y-2">{children}</ol>,
              li: ({children}) => <li className="leading-relaxed">{children}</li>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </Layout>
  )
}
