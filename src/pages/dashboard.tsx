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
      <div className="max-w-5xl mx-auto px-12">
        {/* Hero Section with massive negative space */}
        <div className="pt-32 pb-40">
          <div className="max-w-4xl">
            <h1 className="text-7xl font-extralight text-neutral-900 mb-12 tracking-tight leading-[0.9] -ml-1">
              Moments that<br />matter —
            </h1>
            <div className="w-24 h-px bg-neutral-300 mb-12"></div>
            <p className="text-xl text-neutral-500 leading-relaxed max-w-2xl font-light">
              We change the world with our thoughts, experiences, and actions. 
              Every moment is valuable, every experience worth remembering.
            </p>
          </div>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-end justify-between mb-32">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
              Search
            </span>
            <input
              type="text"
              placeholder="Find stories"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-2xl font-light text-neutral-900 placeholder-neutral-400 focus:outline-none w-80"
            />
            <div className="w-full h-px bg-neutral-200 mt-2"></div>
          </div>
          
          <button
            onClick={() => navigate("/editor")}
            className="text-neutral-500 hover:text-neutral-900 transition-all duration-300 font-light text-lg group"
          >
            <span className="border-b border-transparent group-hover:border-neutral-300 transition-all duration-300">
              Write new story
            </span>
          </button>
        </div>

        {/* Posts with extreme spacing */}
        <div className="pb-32">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-40">
              <div className="max-w-md mx-auto">
                <div className="w-1 h-24 bg-neutral-200 mx-auto mb-12"></div>
                <p className="text-neutral-400 text-xl font-light mb-12 leading-relaxed">
                  No stories yet.<br />
                  Your first story awaits.
                </p>
                <button
                  onClick={() => navigate("/editor")}
                  className="text-neutral-600 hover:text-neutral-900 transition-all duration-300 font-light text-lg group"
                >
                  <span className="border-b border-transparent group-hover:border-neutral-300 transition-all duration-300">
                    Begin writing
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-32">
              {filteredPosts.map((post, index) => (
                <article key={post.id} className="group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="grid grid-cols-12 gap-16 items-start">
                    {/* Content */}
                    <div className="col-span-7">
                      <div className="mb-8">
                        <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <h2 className="text-4xl font-extralight text-neutral-900 mb-8 group-hover:text-neutral-600 transition-all duration-500 leading-tight tracking-tight">
                        {post.title}
                      </h2>
                      
                      <div className="w-16 h-px bg-neutral-200 mb-8"></div>
                      
                      <p className="text-neutral-500 leading-relaxed text-lg font-light mb-12 max-w-lg">
                        {post.content?.replace(/[#*`]/g, '').substring(0, 180)}...
                      </p>
                      
                      <div className="flex items-center gap-8 text-sm text-neutral-400">
                        <span className="font-light">
                          {post.createdAt?.toDate().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        
                        {post.tags?.length > 0 && (
                          <div className="flex gap-4">
                            {post.tags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-neutral-400 font-light">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Minimal image placeholder */}
                    <div className="col-span-5">
                      <div className="aspect-[5/4] bg-gradient-to-br from-neutral-100 via-neutral-50 to-white border border-neutral-100 group-hover:border-neutral-200 transition-all duration-500"></div>
                    </div>
                  </div>
                  
                  {/* Hidden actions */}
                  <div className="flex items-center gap-8 mt-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/editor/${post.id}`)
                      }}
                      className="text-neutral-400 hover:text-neutral-700 transition-colors text-sm font-light"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(post.id)
                      }}
                      className="text-neutral-400 hover:text-red-400 transition-colors text-sm font-light"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}