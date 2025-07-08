// src/pages/ViewPost.tsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
    <div className="max-w-3xl mx-auto mt-10 px-4 prose">
      <h1>{post.title}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {post.content}
      </ReactMarkdown>
    </div>
  )
}
