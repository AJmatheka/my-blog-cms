import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ReactMde from "react-mde"
import Showdown from "showdown"
import { db, auth, storage } from "../firebase"
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import "react-mde/lib/styles/css/react-mde-all.css"
import Layout from "../components/Layout"

const converter = new Showdown.Converter()

export default function EditorPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState("")

  const { postId } = useParams()
  const navigate = useNavigate()
  const user = auth.currentUser

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const docRef = doc(db, "posts", postId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const post = docSnap.data()
          setTitle(post.title)
          setContent(post.content)
          setTags(post.tags || [])
          setTagsInput("")
        }
      }
    }
    fetchPost()
  }, [postId])

  const handleSave = async () => {
    if (!user) return

    const postRef = postId
      ? doc(db, "posts", postId)
      : doc(db, "posts", Date.now().toString())

    const payload = {
      title,
      content,
      tags,
      authorId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await setDoc(postRef, payload)
    navigate("/dashboard")
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagsInput.trim() !== "") {
      e.preventDefault()
      const newTag = tagsInput.trim()
      if (!tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag])
        setTagsInput("")
      }
    }
  }

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags]
    updatedTags.splice(index, 1)
    setTags(updatedTags)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    setContent((prev) => `${prev}\n\n![alt text](${downloadURL})`)
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-orange rounded-full"></div>
              <div className="w-3 h-3 bg-accent-red rounded-full"></div>
            </div>
            <span className="text-accent-orange text-sm font-semibold uppercase tracking-wider">
              {postId ? 'Edit Story' : 'New Story'}
            </span>
          </div>
          
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            {postId ? 'Edit Your Story' : 'Create Something Amazing'}
          </h1>
          <p className="text-neutral-400 text-xl">
            Share your thoughts and inspire others
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Input */}
            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-3 uppercase tracking-wider">
                Story Title
              </label>
              <input
                className="w-full bg-transparent border-b-2 border-dark-600 focus:border-accent-orange text-4xl font-display font-bold text-white placeholder-neutral-500 focus:outline-none pb-4 transition-colors"
                placeholder="Enter your story title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Markdown Editor */}
            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-3 uppercase tracking-wider">
                Content
              </label>
              <div className="prose-editor">
                <ReactMde
                  value={content}
                  onChange={setContent}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                  }
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tags */}
            <div className="magazine-card p-6">
              <h3 className="text-white font-display font-bold text-xl mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 bg-accent-orange/20 text-accent-orange px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="text-accent-orange hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length >= 5 ? "Max 5 tags" : "Add tag and press Enter..."}
                className="w-full magazine-input"
                disabled={tags.length >= 5}
              />
              {tags.length >= 5 && (
                <p className="text-accent-red text-sm mt-2">
                  Maximum 5 tags allowed
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="magazine-card p-6">
              <h3 className="text-white font-display font-bold text-xl mb-4">Add Media</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent-orange file:text-white hover:file:bg-accent-orange/90 transition-colors"
              />
              <p className="text-neutral-400 text-sm mt-2">
                Upload images to enhance your story
              </p>
            </div>

            {/* Publishing Options */}
            <div className="magazine-card p-6">
              <h3 className="text-white font-display font-bold text-xl mb-4">Publish</h3>
              <div className="space-y-4">
                <button
                  onClick={handleSave}
                  className="w-full magazine-button py-3"
                >
                  {postId ? "Update Story" : "Publish Story"}
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full border border-neutral-600 hover:border-neutral-500 text-neutral-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-dark-600">
                <p className="text-neutral-400 text-sm">
                  Your story will be published immediately and visible to all readers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}