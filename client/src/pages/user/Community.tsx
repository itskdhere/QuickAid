import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [likeInProgress, setLikeInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/v1/community/posts", {
        withCredentials: true,
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with an error status
          const status = error.response.status;

          if (status === 401) {
            setError("You need to be logged in to view community posts");
            toast.error("Authentication required");
          } else if (status === 403) {
            setError("You don't have permission to access the community");
            toast.error("Access denied");
          } else if (status === 404) {
            setError("Community posts not found");
            toast.error("Resource not found");
          } else if (status >= 500) {
            setError("Server error. Please try again later");
            toast.error("Server error");
          } else {
            setError(`Failed to load posts (${status})`);
            toast.error("Failed to load posts");
          }
        } else if (error.request) {
          // Request was made but no response received
          setError("Network error. Please check your internet connection");
          toast.error("Network error");
        } else {
          // Error in setting up the request
          setError("Failed to load posts");
          toast.error("Request error");
        }
      } else {
        // Not an Axios error
        setError("An unexpected error occurred while loading posts");
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPost.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        "/api/v1/community/posts",
        { content: newPost },
        { withCredentials: true }
      );

      if (!response.data || !response.data.id) {
        throw new Error("Invalid response format");
      }

      setPosts([response.data, ...posts]);
      setNewPost("");
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const errorMessage = error.response.data?.message || "Unknown error";

          if (status === 401) {
            toast.error("You need to be logged in to create a post");
          } else if (status === 403) {
            toast.error("You don't have permission to create posts");
          } else if (status === 413) {
            toast.error("Your post is too long. Please shorten it");
          } else if (status >= 500) {
            toast.error("Server error. Please try again later");
          } else {
            toast.error(`Failed to create post: ${errorMessage}`);
          }
        } else if (error.request) {
          toast.error("Network error. Please check your internet connection");
        } else {
          toast.error("Failed to create post");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (likeInProgress === postId) return; // Prevent double-clicking

    try {
      setLikeInProgress(postId);

      const response = await axios.post(
        `/api/v1/community/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

      if (
        response.data === undefined ||
        typeof response.data.likes !== "number"
      ) {
        throw new Error("Invalid response format");
      }

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
      console.error("Error liking post:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;

          if (status === 401) {
            toast.error("You need to be logged in to like posts");
          } else if (status === 404) {
            toast.error("Post not found");
            // Remove the post from the list if it doesn't exist
            setPosts(posts.filter((post) => post.id !== postId));
          } else {
            toast.error("Failed to like post");
          }
        } else if (error.request) {
          toast.error("Network error. Please check your internet connection");
        } else {
          toast.error("Failed to like post");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLikeInProgress(null);
    }
  };

  const handleRetry = () => {
    fetchPosts();
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
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Share something with the community..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={submitting}
            ></textarea>
          </div>
          <div className="text-right">
            <Button
              type="submit"
              variant="default"
              className="px-4 py-2 rounded-md"
              disabled={!newPost.trim() || submitting}
            >
              {submitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>

        {/* Posts Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Posts</h2>

          {loading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : error ? (
            <div className="p-4 border border-red-700 bg-red-900/20 rounded-md flex flex-col items-center gap-4">
              <div className="flex gap-2 items-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-red-400">{error}</p>
              </div>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Retry
              </Button>
            </div>
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
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                      onDoubleClick={() => handleLikePost(post.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-md">
                          {post.username || "Anonymous"}
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
                          } ${likeInProgress === post.id ? "opacity-50" : ""}`}
                          onClick={() => handleLikePost(post.id)}
                          disabled={likeInProgress === post.id}
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
