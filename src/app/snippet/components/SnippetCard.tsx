"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { FaRegCommentDots } from "react-icons/fa";
import axios from "axios";

type AuthorType = {
  id: number;
  username: string;
  email: string;
  isOnline: boolean;
};

type SnippetType = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  author: AuthorType;
};

type CommentType = {
  id: number;
  comment: string;
  createdAt: string;
  user: { username: string };
};

export default function SnippetCard({ snippets }: { snippets: SnippetType[] }) {
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);

  const handleReply = async () => {
    if (!selectedPostId) return;
    try {
      await axios.post("/server/comment/create", {
        comment,
        postId: selectedPostId,
      });
      setComment("");
      setShowModal(false);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleShowComment = async (postId: number) => {
    try {
      const res = await axios.get(`/server/comment/get?postId=${postId}`);
      setComments(res.data.comments);
      setShowCommentsModal(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {snippets.map((snippet) => (
        <div
          key={snippet.id}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-800 transition hover:shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Posted by{" "}
                <span className="font-semibold text-gray-800 dark:text-white">
                  @{snippet.author.username}
                </span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {format(new Date(snippet.createdAt), "MMM dd, yyyy • HH:mm")}
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              Post #{snippet.id}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {snippet.title}
          </h3>

          {/* Content */}
          <pre className="bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 rounded-md p-4 overflow-x-auto mb-4 whitespace-pre-wrap">
            {snippet.content}
          </pre>

          {/* Tags */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                Languages:
              </span>
              {snippet.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-xs font-medium px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedPostId(snippet.id);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <FaRegCommentDots />
              Comment
            </button>
            <button
              onClick={() => handleShowComment(snippet.id)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Comments
            </button>
          </div>
        </div>
      ))}

      {/* Comment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Add Comment
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleReply();
              }}
              className="p-4"
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
              <button
                type="submit"
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Comments
              </h2>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No comments yet.
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800"
                  >
                    <p className="text-gray-800 dark:text-white text-sm">
                      {c.comment}
                    </p>
                    <div className="mt-1 text-xs text-gray-500 flex justify-between">
                      <span>By @{c.user.username}</span>
                      <span>
                        {format(new Date(c.createdAt), "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
