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
        {/* Hero Section - Main Featured Article */}
        {featuredPost ? (
          <section className="py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="mb-6">
                  <span className="text-accent-orange text-sm font-bold uppercase tracking-wider">
                    FEATURED ARTICLE
                  </span>
                  <h2 className="text-neutral-400 text-sm mt-1 uppercase tracking-wider">
                    Fine Photography
                  </h2>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-[0.9]">
                  {featuredPost.title}
                </h1>
                
                <p className="text-neutral-300 text-xl leading-relaxed mb-10 max-w-lg">
                  {featuredPost.content?.replace(/[#*`]/g, '').substring(0, 200)}...
                </p>
                
                <div className="flex items-center gap-6 mb-8">
                  <button 
                    onClick={() => navigate(`/post/${featuredPost.id}`)}
                    className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors"
                  >
                    READ MORE
                  </button>
                  <button 
                    onClick={() => navigate(`/editor/${featuredPost.id}`)}
                    className="border-2 border-neutral-600 hover:border-accent-orange text-neutral-300 hover:text-accent-orange px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors"
                  >
                    EDIT
                  </button>
                </div>
                
                <div className="flex items-center gap-8 text-sm text-neutral-400">
                  <span className="font-medium">
                    {featuredPost.createdAt?.toDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {featuredPost.tags?.length > 0 && (
                    <div className="flex gap-4">
                      {featuredPost.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-accent-orange font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-neutral-700 via-neutral-600 to-neutral-500 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full font-medium">
                      Featured Story
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-dark-700 rounded-full mx-auto mb-8 flex items-center justify-center">
                <span className="text-3xl">📝</span>
              </div>
              <h1 className="text-5xl font-display font-bold text-white mb-6">
                Start Your Story
              </h1>
              <p className="text-neutral-400 text-xl mb-10 leading-relaxed">
                Create your first article and share it with the world.
              </p>
              <button
                onClick={() => navigate("/editor")}
                className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors"
              >
                Write First Story
              </button>
            </div>
          </section>
        )}

        {/* Search and Controls */}
        <section className="py-8 border-t border-dark-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search stories, tags, or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-800 border-2 border-dark-600 focus:border-accent-orange text-white placeholder-neutral-400 px-6 py-4 rounded-lg focus:outline-none transition-colors text-lg"
              />
            </div>
            <button
              onClick={() => navigate("/editor")}
              className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors"
            >
              + New Story
            </button>
          </div>
        </section>

        {/* Latest Stories Section */}
        {recentPosts.length > 0 && (
          <section className="py-16">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">
                  Latest Stories
                </h2>
                <p className="text-neutral-400 text-lg">
                  Fresh content from our community
                </p>
              </div>
              <div className="bg-accent-red text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider">
                Have You Heard Our Podcast Yet?
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <article key={post.id} className="group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="bg-dark-800 border-2 border-dark-600 group-hover:border-accent-orange rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                    <div className="aspect-[4/3] bg-gradient-to-br from-neutral-700 to-neutral-600 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent-orange text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                          Article
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="text-white text-sm font-medium">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-accent-orange transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                        {post.content?.replace(/[#*`]/g, '').substring(0, 120)}...
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider">
                          {post.createdAt?.toDate().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/editor/${post.id}`)
                            }}
                            className="text-neutral-400 hover:text-accent-orange transition-colors text-xs font-bold uppercase tracking-wider"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(post.id)
                            }}
                            className="text-neutral-400 hover:text-accent-red transition-colors text-xs font-bold uppercase tracking-wider"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Layout - Spotlight & Newsletter */}
        <section className="py-16 border-t border-dark-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Spotlight on Artists */}
            <div>
              <div className="mb-12">
                <h2 className="text-4xl font-display font-bold text-white mb-2">
                  Spotlight on Artists
                </h2>
                <p className="text-neutral-400 text-lg">
                  Featuring creative minds and their work
                </p>
              </div>
              
              <div className="space-y-8">
                {spotlightPosts.slice(0, 3).map((post, index) => (
                  <article key={post.id} className="flex gap-6 group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                    <div className="w-24 h-24 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-xl flex-shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-1 right-1">
                        <span className="text-white text-xs font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-accent-orange transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                        {post.content?.replace(/[#*`]/g, '').substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span className="font-medium uppercase tracking-wider">
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
                          className="text-neutral-400 hover:text-accent-orange transition-colors font-bold uppercase tracking-wider"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="bg-dark-800 border-2 border-dark-600 rounded-2xl p-10 h-fit">
              <h3 className="text-3xl font-display font-bold text-white mb-6">
                Sign Up for Our Newsletter
              </h3>
              <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                Get the latest stories, insights, and creative inspiration delivered straight to your inbox.
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-dark-700 border-2 border-dark-600 focus:border-accent-orange text-white placeholder-neutral-400 px-6 py-4 rounded-lg focus:outline-none transition-colors text-lg"
                />
                <button className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors">
                  Subscribe Now
                </button>
              </div>
              <p className="text-neutral-500 text-sm mt-4">
                Join 10,000+ readers who never miss our updates
              </p>
            </div>
          </div>
        </section>

        {/* Must-See Moments */}
        {mustSeePosts.length > 0 && (
          <section className="py-16 border-t border-dark-700">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">
                  Must-See Moments
                </h2>
                <p className="text-neutral-400 text-lg">
                  Don't miss these incredible stories
                </p>
              </div>
              <div className="flex gap-3">
                <button className="w-12 h-12 bg-dark-700 hover:bg-accent-orange border-2 border-dark-600 hover:border-accent-orange rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-lg font-bold">←</span>
                </button>
                <button className="w-12 h-12 bg-dark-700 hover:bg-accent-orange border-2 border-dark-600 hover:border-accent-orange rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-lg font-bold">→</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mustSeePosts.map((post, index) => (
                <article key={post.id} className="group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="bg-dark-800 border-2 border-dark-600 group-hover:border-accent-orange rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                    <div className="aspect-[4/3] bg-gradient-to-br from-neutral-700 to-neutral-600 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-accent-orange text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                          Featured
                        </span>
                        <span className="bg-dark-800/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                          Article
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="text-white text-sm font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-accent-orange transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                        {post.content?.replace(/[#*`]/g, '').substring(0, 100)}...
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider">
                          {post.createdAt?.toDate().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/editor/${post.id}`)
                            }}
                            className="text-neutral-400 hover:text-accent-orange transition-colors text-xs font-bold uppercase tracking-wider"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(post.id)
                            }}
                            className="text-neutral-400 hover:text-accent-red transition-colors text-xs font-bold uppercase tracking-wider"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}