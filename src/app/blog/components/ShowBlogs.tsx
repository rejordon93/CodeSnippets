import React from "react";

type BlogProps = {
  blog: {
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
  };
};
export default function ShowBlogs({ blog }: BlogProps) {
  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-2xl text-blue-700 mb-2">
          {blog.title}
        </div>
        <p className="text-gray-700 text-base leading-relaxed line-clamp-4">
          {blog.content}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(blog.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      {blog.tags?.length > 0 && (
        <div className="px-6 pt-2 pb-4 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium shadow-sm hover:bg-blue-200 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
