// src/pages/Dashboard.tsx
import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPosts(data)
    }
    fetchPosts()
  }, [])

  const filteredPosts = posts.filter((post) => {
    const searchLower = search.toLowerCase()
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
    )
  })

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "posts", id))
    setPosts(posts.filter((post) => post.id !== id))
  }


  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Your Posts</h1>
        <button
          onClick={() => navigate("/editor")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + New Post
        </button>
      </div>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />
      <ul>
        {filteredPosts.map((post) => (
          <li key={post.id} className="border p-4 mb-2 rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {post.tags?.length ? (
                post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="text-sm cursor-pointer bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-600">No tags</span>
              )}
            </div>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => navigate(`/editor/${post.id}`)}
                className="text-blue-600 underline"
              >
                Edit
              </button>
              <button
                onClick={() => navigate(`/post/${post.id}`)}
                className="text-green-600 underline"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-red-600 underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
