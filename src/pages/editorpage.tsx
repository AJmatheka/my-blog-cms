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
          setTagsInput("") // We now use chips, so clear input
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
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-serif text-reseda_green-100 mb-2">
            {postId ? 'Edit Story' : 'New Story'}
          </h1>
          <p className="text-sage-400">
            Share your thoughts with the world
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Title Input */}
          <input
            className="w-full bg-transparent border-none text-4xl font-serif text-reseda_green-100 placeholder-sage-400 focus:outline-none"
            placeholder="Story title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Tags */}
          <div>
            <label className="block text-sage-400 mb-3 text-sm">Tags</label>
            <div className="flex flex-wrap gap-2 items-center bg-champagne_pink-800/20 border border-sage-300/20 rounded-lg p-4 min-h-[60px]">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-buff-500/20 text-buff-300 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="text-buff-400 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length >= 5 ? "" : "Add tag..."}
                className="flex-1 min-w-[120px] bg-transparent text-reseda_green-100 placeholder-sage-400 focus:outline-none"
                disabled={tags.length >= 5}
              />
            </div>
            {tags.length >= 5 && (
              <p className="text-sm text-red-400 mt-2">
                Maximum 5 tags allowed
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sage-400 mb-3 text-sm">Add Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sage-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-buff-500/20 file:text-buff-300 hover:file:bg-buff-500/30 transition-colors"
            />
          </div>

          {/* Markdown Editor */}
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

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-sage-300/20">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sage-400 hover:text-reseda_green-300 transition-colors"
            >
              ← Back to stories
            </button>
            
            <button
              onClick={handleSave}
              className="bg-buff-500 hover:bg-buff-400 text-champagne_pink-900 px-8 py-3 rounded-full font-medium transition-colors"
            >
              {postId ? "Update Story" : "Publish Story"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
