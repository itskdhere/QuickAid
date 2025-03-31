import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  content: string;
  username: string;
  pfp?: string;
  createdAt: string;
  likes: number;
  liked?: boolean;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/community/posts", {
        withCredentials: true,
      });
      setPosts(response.data);
    } catch (error) {
      toast.error("Failed to load posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await axios.post(
        "/api/v1/community/posts",
        { content: newPost },
        { withCredentials: true }
      );
      setPosts([response.data, ...posts]);
      setNewPost("");
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Failed to create post");
      console.error(error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await axios.post(
        `/api/v1/community/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

      // Update the posts state with the new like status
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: response.data.likes,
                liked: response.data.liked,
              }
            : post
        )
      );
    } catch (error) {
      toast.error("Failed to like post");
      console.error(error);
    }
  };

  return (
    <div className="dark min-h-screen space-y-10 bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <NavBar backBtn />
      <div className="space-y-6 relative p-4 border border-gray-700 rounded text-gray-300">
        {/* Header */}
        <p className="text-2xl text-center mb-6">Community</p>

        {/* Create Post Form */}
        <form onSubmit={handleSubmitPost} className="mb-8">
          <div className="mb-4">
            <textarea
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Share something with the community..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            ></textarea>
          </div>
          <div className="text-right">
            <Button
              type="submit"
              variant="default"
              className="px-4 py-2 rounded-md"
              disabled={!newPost.trim()}
            >
              Post
            </Button>
          </div>
        </form>

        {/* Posts Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Posts</h2>

          {loading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No posts yet. Be the first to share!
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(
                (post) =>
                  post && (
                    <div
                      key={post.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-"
                      onDoubleClick={() => handleLikePost(post.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-md">
                          {post.username}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString([], {
                            day: "2-digit",
                          })}
                          {"/"}
                          {new Date(post.createdAt).toLocaleDateString([], {
                            month: "2-digit",
                          })}
                          {"/"}
                          {new Date(post.createdAt).toLocaleDateString([], {
                            year: "2-digit",
                          })}
                          {", "}
                          {new Date(post.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                      </div>
                      <p className="mb-4">{post.content}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <button
                          className={`flex items-center hover:text-red-500 select-none ${
                            post.liked ? "text-red-500" : ""
                          }`}
                          onClick={() => handleLikePost(post.id)}
                        >
                          <span>
                            {post.liked ? <FaHeart /> : <FaRegHeart />}
                          </span>
                          <span className="ml-1.5">{post.likes}</span>
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
