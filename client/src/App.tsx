import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";

type PostType = {
  body: String;
  date?: Date;
  title: String;
  __v?: Number;
  _id?: String;
};

export default function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    getBlogPost();
  }, []);

  const getBlogPost = () => {
    axios
      .get("/games")
      .then((response) => {
        const data = response.data as PostType[];
        setPosts(data);
        console.log("Data has been received!!");
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  };

  const resetUserInputs = () => {
    setTitle("");
    setBody("");
  };

  const displayBlogPost = (posts: PostType[]) => {
    if (!posts.length) return null;

    return posts.map((post, index) => (
      <div key={index} className="blog-post__display">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
    ));
  };

  const submit = (event: any) => {
    event.preventDefault();

    const payload = {
      title: title,
      body: body,
      date: new Date(),
    } as PostType;

    axios({
      url: "/api/save",
      method: "POST",
      data: payload,
    })
      .then(() => {
        console.log("Data has been sent to the server");
        resetUserInputs();
        getBlogPost();
      })
      .catch(() => {
        console.log("Internal server error");
      });
  };

  const handleChange = ({ target }: { target: any }) => {
    const { name, value } = target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "body") {
      setBody(value);
    }
  };

  return (
    <div className="app">
      <h2>Welcome to the best app ever {new Date().toLocaleTimeString()}</h2>
      <form onSubmit={submit}>
        <div className="form-input">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={handleChange}
          />
        </div>
        <div className="form-input">
          <textarea
            placeholder="body"
            name="body"
            cols={30}
            rows={10}
            value={body}
            onChange={handleChange}
          ></textarea>
        </div>

        <button>Submit</button>
      </form>

      <div className="blog-">{displayBlogPost(posts)}</div>
    </div>
  );
}
