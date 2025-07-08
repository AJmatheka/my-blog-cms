import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ReactMde from "react-mde"
import Showdown from "showdown"
import { db, auth, storage } from "../firebase"
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import "react-mde/lib/styles/css/react-mde-all.css"

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
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <input
        className="w-full border p-2 mb-4 text-xl font-semibold"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Pretty Tags UI */}
      <div className="my-4">
        <label className="block font-medium mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 items-center border p-2 rounded min-h-[56px]">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="text-blue-500 hover:text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={tags.length >= 5 ? "" : "Add tag"}
            className="flex-1 min-w-[100px] outline-none"
            disabled={tags.length >= 5}
          />
        </div>
        {tags.length >= 5 && (
          <p className="text-sm text-red-600 mt-1">
            Max 5 tags allowed.
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div className="my-4">
        <label className="block mb-1 font-medium">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
      </div>

      {/* Markdown Editor */}
      <ReactMde
        value={content}
        onChange={setContent}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
      />

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {postId ? "Update Post" : "Publish Post"}
      </button>
    </div>
  )
}
