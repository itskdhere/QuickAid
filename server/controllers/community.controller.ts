import { Request, Response } from "express";
import { IUser } from "../db/models/user.model.js";
import Post from "../db/models/community.model.js";
import { z } from "zod";

interface PopulatedPost {
  _id: string;
  user: {
    _id: string;
    name: string;
    pfp: string;
  };
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
}

export const getAllPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as IUser).id;
    const posts = (await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name pfp")
      .lean()) as unknown as PopulatedPost[];

    const formattedPosts = posts.map((post) => {
      const isLiked = post.likedBy && post.likedBy.includes(userId);
      return {
        id: post._id,
        content: post.content,
        username: post.user.name,
        pfp: post.user.pfp,
        createdAt: post.createdAt,
        likes: post.likes,
        liked: isLiked,
      };
    });

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Failed to fetch posts",
      },
    });
  }
};

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schema = z.object({
    content: z
      .string()
      .trim()
      .min(1, "Content is required")
      .max(500, "Content cannot exceed 500 characters"),
  });

  try {
    const { content } = schema.parse(req.body);
    const user = req.user as IUser;

    const newPost = new Post({
      content,
      user: user._id,
      likedBy: [],
    });

    await newPost.save();

    const postResponse = {
      id: newPost._id,
      content: newPost.content,
      username: user.name,
      createdAt: newPost.createdAt,
      likes: 0,
      liked: false,
    };

    res.status(201).json(postResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: "error",
        error: {
          code: 400,
          message: error.errors.map((e) => e.message).join(", "),
        },
      });
      return;
    }

    console.error("Error creating post:", error);
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Failed to create post",
      },
    });
  }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as IUser).id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({
        status: "error",
        error: {
          code: 404,
          message: "Post not found",
        },
      });
      return;
    }

    // Check if user already liked this post
    const alreadyLiked = post.likedBy && post.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike the post
      post.likes = Math.max(0, post.likes - 1); // Prevent negative likes
      post.likedBy = post.likedBy.filter((id) => id !== userId);
      await post.save();
      res.status(200).json({ likes: post.likes, liked: false });
    } else {
      // Like the post
      post.likes += 1;
      if (!post.likedBy) {
        post.likedBy = [];
      }
      post.likedBy.push(userId);
      await post.save();
      res.status(200).json({ likes: post.likes, liked: true });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      status: "error",
      error: {
        code: 500,
        message: "Failed to process like action",
      },
    });
  }
};
