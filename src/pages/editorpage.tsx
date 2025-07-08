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
      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="mb-16">
          <h1 className="text-4xl font-light text-warm-900 mb-4">
            {postId ? 'Edit Story' : 'Write Something New'}
          </h1>
          <p className="text-warm-700 text-lg">
            Share your thoughts with the world
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Title Input */}
          <div>
            <input
              className="w-full bg-transparent border-none text-5xl font-light text-warm-900 placeholder-warm-600 focus:outline-none leading-tight"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-warm-700 mb-4 text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-3 items-center border-b border-sage-200 pb-4 min-h-[60px]">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-sage-100 text-warm-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="text-warm-600 hover:text-red-500 transition-colors"
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
                className="flex-1 min-w-[120px] bg-transparent text-warm-900 placeholder-warm-600 focus:outline-none"
                disabled={tags.length >= 5}
              />
            </div>
            {tags.length >= 5 && (
              <p className="text-sm text-red-500 mt-2">
                Maximum 5 tags allowed
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-warm-700 mb-4 text-sm font-medium">Add Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-warm-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-sage-100 file:text-warm-800 hover:file:bg-sage-200 transition-colors"
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
          <div className="flex items-center justify-between pt-12 border-t border-sage-200">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-warm-600 hover:text-warm-800 transition-colors"
            >
              ← Back
            </button>
            
            <button
              onClick={handleSave}
              className="bg-warm-600 hover:bg-warm-700 text-cream-50 px-8 py-3 rounded-full font-medium transition-colors"
            >
              {postId ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}