import React from "react";

function YouTubeList({ title, videos }) {
  if (!videos || videos.length === 0) return null;
  return (
    <div className="mb-4">
      <h4>{title}</h4>
      <ul className="list-group">
        {videos.map((vid, i) => (
          <li key={i} className="list-group-item">
            <a href={vid.url} target="_blank" rel="noopener noreferrer">
              {vid.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default YouTubeList;
