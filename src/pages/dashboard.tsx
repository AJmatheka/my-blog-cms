import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"

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
    <Layout>
      <div className="max-w-4xl mx-auto px-8 py-20">
        {/* Hero Section */}
        <div className="mb-32">
          <h1 className="text-6xl font-light text-neutral-900 mb-8 tracking-tight leading-tight">
            Moments that matter —
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
            We change the world with our thoughts, experiences, and actions. 
            Every moment is valuable, every experience worth remembering and 
            every thought worth sharing.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-20">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-b border-neutral-300 pb-2 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 transition-colors w-80"
            />
          </div>
          <button
            onClick={() => navigate("/editor")}
            className="text-neutral-900 hover:text-neutral-600 transition-colors font-medium"
          >
            Write new post →
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-20">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-neutral-500 text-lg mb-8">No stories yet</p>
              <button
                onClick={() => navigate("/editor")}
                className="text-neutral-900 hover:text-neutral-600 transition-colors font-medium"
              >
                Write your first story →
              </button>
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <article key={post.id} className="group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                <div className="grid grid-cols-12 gap-8 items-start">
                  {/* Content */}
                  <div className="col-span-8">
                    <h2 className="text-3xl font-light text-neutral-900 mb-4 group-hover:text-neutral-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    
                    <p className="text-neutral-600 leading-relaxed mb-6 text-lg">
                      {post.content?.substring(0, 200)}...
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-neutral-500">
                      <span>
                        {post.createdAt?.toDate().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      
                      {post.tags?.length > 0 && (
                        <div className="flex gap-2">
                          {post.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-neutral-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Image placeholder */}
                  <div className="col-span-4">
                    <div className="aspect-[4/3] bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 rounded-lg"></div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-6 mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/editor/${post.id}`)
                    }}
                    className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(post.id)
                    }}
                    className="text-neutral-500 hover:text-red-500 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
                
                {index < filteredPosts.length - 1 && (
                  <div className="border-b border-neutral-200 mt-20"></div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}