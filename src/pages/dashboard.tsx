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

  const featuredPost = filteredPosts[0]
  const recentPosts = filteredPosts.slice(1, 4)
  const spotlightPosts = filteredPosts.slice(4, 6)
  const mustSeePosts = filteredPosts.slice(6, 9)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        {featuredPost && (
          <section className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <span className="text-accent-orange text-sm font-semibold uppercase tracking-wider">
                    Featured Article
                  </span>
                  <h2 className="text-sm text-neutral-400 mt-1">Fine Photography</h2>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                  {featuredPost.title}
                </h1>
                
                <p className="text-neutral-300 text-lg leading-relaxed mb-8 max-w-lg">
                  {featuredPost.content?.replace(/[#*`]/g, '').substring(0, 200)}...
                </p>
                
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => navigate(`/post/${featuredPost.id}`)}
                    className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Read More
                  </button>
                  <button 
                    onClick={() => navigate(`/editor/${featuredPost.id}`)}
                    className="border border-neutral-600 hover:border-neutral-500 text-neutral-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-neutral-400">
                  <span>
                    {featuredPost.createdAt?.toDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {featuredPost.tags?.length > 0 && (
                    <div className="flex gap-3">
                      {featuredPost.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-accent-orange">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-600 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search and Write Button */}
        <section className="py-8 border-t border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search stories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-800 border border-dark-600 text-white placeholder-neutral-400 px-4 py-3 rounded-lg focus:border-accent-orange focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => navigate("/editor")}
              className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-3 rounded-lg font-medium transition-colors ml-4"
            >
              Write New Story
            </button>
          </div>
        </section>

        {/* Recent Posts Grid */}
        {recentPosts.length > 0 && (
          <section className="py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-white">Latest Stories</h2>
              <div className="text-accent-orange text-sm font-semibold uppercase tracking-wider">
                Have You Heard Our Podcast Yet?
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.id} className="magazine-card group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="aspect-[4/3] bg-gradient-to-br from-neutral-800 to-neutral-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-accent-orange text-xs font-semibold uppercase tracking-wider">
                        Article
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-accent-orange transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                      {post.content?.replace(/[#*`]/g, '').substring(0, 120)}...
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>
                        {post.createdAt?.toDate().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/editor/${post.id}`)
                          }}
                          className="text-neutral-400 hover:text-accent-orange transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(post.id)
                          }}
                          className="text-neutral-400 hover:text-accent-red transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Spotlight Section */}
        {spotlightPosts.length > 0 && (
          <section className="py-12 border-t border-dark-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-4xl font-display font-bold text-white mb-8">
                  Spotlight on Artists
                </h2>
                
                <div className="space-y-6">
                  {spotlightPosts.map((post, index) => (
                    <article key={post.id} className="flex gap-4 group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                      <div className="w-20 h-20 bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-accent-orange transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                          {post.content?.replace(/[#*`]/g, '').substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                          <span>
                            {post.createdAt?.toDate().toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/editor/${post.id}`)
                            }}
                            className="text-neutral-400 hover:text-accent-orange transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              
              <div className="bg-dark-800 rounded-lg p-8">
                <h3 className="text-2xl font-display font-bold text-white mb-6">
                  Sign Up for Our Newsletter
                </h3>
                <p className="text-neutral-400 mb-6">
                  Get the latest stories and updates delivered to your inbox.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full bg-dark-700 border border-dark-600 text-white placeholder-neutral-400 px-4 py-3 rounded-lg focus:border-accent-orange focus:outline-none transition-colors"
                  />
                  <button className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white py-3 rounded-lg font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Must-See Moments */}
        {mustSeePosts.length > 0 && (
          <section className="py-12 border-t border-dark-700">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-display font-bold text-white">
                Must-See Moments
              </h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-dark-700 hover:bg-dark-600 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">←</span>
                </button>
                <button className="w-8 h-8 bg-dark-700 hover:bg-dark-600 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">→</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mustSeePosts.map((post, index) => (
                <article key={post.id} className="group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="aspect-[4/3] bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex gap-2">
                        <span className="bg-accent-orange text-white text-xs px-2 py-1 rounded">Featured</span>
                        <span className="bg-dark-800/80 text-white text-xs px-2 py-1 rounded">Article</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-accent-orange transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                    {post.content?.replace(/[#*`]/g, '').substring(0, 100)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>
                      {post.createdAt?.toDate().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/editor/${post.id}`)
                        }}
                        className="text-neutral-400 hover:text-accent-orange transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(post.id)
                        }}
                        className="text-neutral-400 hover:text-accent-red transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <section className="py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-dark-700 rounded-full mx-auto mb-8 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                No Stories Yet
              </h2>
              <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                Start creating your first story and share it with the world.
              </p>
              <button
                onClick={() => navigate("/editor")}
                className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-4 rounded-lg font-medium transition-colors"
              >
                Write Your First Story
              </button>
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}