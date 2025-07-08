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
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h1 className="text-4xl font-serif text-reseda_green-100 mb-4 tracking-tight">
                Your Stories
              </h1>
              <p className="text-sage-400 text-lg">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}
              </p>
            </div>
            <button
              onClick={() => navigate("/editor")}
              className="bg-buff-500 hover:bg-buff-400 text-champagne_pink-900 px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              New Story
            </button>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-champagne_pink-800/30 border border-sage-300/20 rounded-full px-6 py-3 text-reseda_green-100 placeholder-sage-400 focus:outline-none focus:border-buff-400 transition-colors"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-12">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sage-400 text-lg mb-6">No stories yet</p>
              <button
                onClick={() => navigate("/editor")}
                className="text-buff-400 hover:text-buff-300 transition-colors font-medium"
              >
                Write your first story →
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                <div className="border-b border-sage-300/10 pb-12 hover:border-sage-300/20 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-serif text-reseda_green-100 mb-3 group-hover:text-buff-400 transition-colors leading-tight">
                        {post.title}
                      </h2>
                      
                      {/* Tags */}
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag: string) => (
                            <span
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSearch(tag)
                              }}
                              className="text-xs text-sage-400 hover:text-buff-400 transition-colors cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-sage-400 text-sm">
                        {post.createdAt?.toDate().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity ml-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/editor/${post.id}`)
                        }}
                        className="text-sage-400 hover:text-buff-400 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(post.id)
                        }}
                        className="text-sage-400 hover:text-red-400 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
