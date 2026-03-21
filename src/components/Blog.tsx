import { useMemo, useState } from "react";

type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
};

const POSTS: BlogPost[] = [
  {
    id: "building-a-retro-desktop-portfolio",
    title: "Building a Retro Desktop Portfolio",
    date: "March 21, 2026",
    category: "Devlog",
    excerpt:
      "Why I stopped making generic portfolio sites and built a desktop-style interface instead.",
    content: `I got tired of modern portfolios all looking the same. Same hero section. Same gradient. Same "crafting digital experiences" nonsense.

So I built mine like a retro operating system instead.

The goal was simple: make the site feel memorable. I wanted visitors to click around, open windows, and feel like they were exploring an actual machine instead of scrolling a glorified résumé.

The challenge was balancing nostalgia with usability. The UI needed to feel old-school without becoming annoying. That meant keeping interactions familiar, keeping windows readable, and avoiding fake-retro gimmicks that hurt the experience.

In the end, the best part of the project was that it let my personality show up in the product itself.`,
  },
  {
    id: "adding-wolf3d-to-my-site",
    title: "Adding Wolfenstein 3D to My Portfolio",
    date: "March 20, 2026",
    category: "Experiments",
    excerpt:
      "A breakdown of how I embedded a browser-playable game inside my portfolio window system.",
    content: `At first I tried a DOSBox-style integration. It was cool in theory and annoying in practice.

The browser-native route ended up being better for a portfolio. Fewer moving parts, less emulator weirdness, and a cleaner user experience overall.

The main lesson: visitors do not care how painfully authentic your setup is if the result loads badly. They care that it works and feels intentional.

So I switched to a self-contained browser build inside an iframe and wrapped it in my existing desktop UI. Cleaner, faster, and much easier to maintain.`,
  },
  {
    id: "why-i-like-weird-projects",
    title: "Why Weird Projects Beat Safe Ones",
    date: "March 18, 2026",
    category: "Thoughts",
    excerpt:
      "Why memorable, opinionated builds get more attention than another polished but forgettable app clone.",
    content: `A lot of people build safe portfolio projects because they think "professional" means bland.

I disagree.

Weird projects are memorable. A browser OS, a retro game launcher, a creepy analog-horror microsite — those things tell me more about a builder than another task manager ever will.

Safe projects can prove competence. Weird projects prove taste.

And taste is usually the part people can't fake.`,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Devlog: "var(--color-blue)",
  Experiments: "#8b0000",
  Thoughts: "#1a5c1a",
};

export default function Blog() {
  const [selectedId, setSelectedId] = useState<string>(POSTS[0]?.id ?? "");
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return POSTS;
    return POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q),
    );
  }, [search]);

  const selectedPost =
    filteredPosts.find((p) => p.id === selectedId) ?? filteredPosts[0] ?? null;

  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
      }}
    >
      {/* ── Left pane — post list ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--color-gray-300)",
          background: "var(--color-gray-200)",
        }}
      >
        {/* Search */}
        <div
          style={{
            padding: "6px 8px",
            borderBottom: "1px solid var(--color-gray-300)",
          }}
        >
          <input
            className="field"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            style={{
              width: "100%",
              fontFamily: "Tahoma, Arial, sans-serif",
              fontSize: 11,
            }}
          />
        </div>

        {/* Post entries */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredPosts.length === 0 ? (
            <div style={{ padding: "10px 8px", color: "#555", fontSize: 11 }}>
              No posts found.
            </div>
          ) : (
            filteredPosts.map((post) => {
              const active = selectedPost?.id === post.id;
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedId(post.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    border: "none",
                    borderBottom: "1px solid var(--color-gray-300)",
                    background: active ? "var(--color-blue)" : "transparent",
                    color: active ? "#fff" : "#000",
                    cursor: "pointer",
                    fontFamily: "Tahoma, Arial, sans-serif",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 11,
                      marginBottom: 3,
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>{post.date}</div>
                  <div
                    style={{
                      marginTop: 3,
                      display: "inline-block",
                      fontSize: 9,
                      padding: "0 4px",
                      background: active
                        ? "rgba(255,255,255,0.2)"
                        : (CATEGORY_COLORS[post.category] ?? "#444"),
                      color: "#fff",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {post.category}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Post count */}
        <div
          style={{
            padding: "3px 8px",
            borderTop: "1px solid var(--color-gray-300)",
            fontSize: 10,
            color: "#666",
            boxShadow: "inset 0 1px 0 #fff",
          }}
        >
          {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Right pane — post content ──────────────────────────── */}
      <div style={{ overflowY: "auto", background: "#fff" }}>
        {selectedPost ? (
          <div style={{ padding: "16px 20px" }}>
            {/* Header */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  padding: "1px 6px",
                  background:
                    CATEGORY_COLORS[selectedPost.category] ??
                    "var(--color-blue)",
                  color: "#fff",
                  marginBottom: 8,
                  letterSpacing: "0.06em",
                }}
              >
                {selectedPost.category}
              </div>
              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: 18,
                  fontFamily: "Tahoma, Arial, sans-serif",
                  fontWeight: "bold",
                  color: "#000",
                  lineHeight: 1.2,
                }}
              >
                {selectedPost.title}
              </h2>
              <div style={{ fontSize: 11, color: "#777", marginBottom: 10 }}>
                {selectedPost.date}
              </div>
              <p
                style={{
                  margin: 0,
                  fontStyle: "italic",
                  color: "#444",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                {selectedPost.excerpt}
              </p>
            </div>

            {/* Win95 double-rule separator */}
            <div
              style={{
                height: 1,
                background: "var(--color-gray-300)",
                margin: "0 0 1px",
              }}
            />
            <div style={{ height: 1, background: "#fff", marginBottom: 14 }} />

            {/* Body */}
            <article>
              {selectedPost.content.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    margin: i === 0 ? "0 0 12px" : "0 0 12px",
                    lineHeight: 1.75,
                    color: "#222",
                    fontSize: 12,
                    fontFamily: "Tahoma, Arial, sans-serif",
                  }}
                >
                  {para}
                </p>
              ))}
            </article>
          </div>
        ) : (
          <div style={{ padding: 20, color: "#777", fontSize: 12 }}>
            No post selected.
          </div>
        )}
      </div>
    </div>
  );
}
