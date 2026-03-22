import { useState, useEffect, useRef } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

type Era = "Childhood" | "Anime" | "Adult Dramas";

interface Show {
  id: string;
  title: string;
  era: Era;
  years: string;
  genre: string;
  rating: string;
  memory: string;
  synopsis: string;
  icon: string;
  accentColor: string;
  bgGradient: string;
  maturityRating: string;
}

const SHOWS: Show[] = [
  {
    id: "spongebob",
    title: "SpongeBob SquarePants",
    era: "Childhood",
    years: "1999–present",
    genre: "Animated Comedy",
    rating: "10",
    memory:
      "Saturday morning cartoons. Seasons 1–3 are genuinely some of the best writing in television history and I will die on that hill.",
    synopsis:
      "An optimistic sea sponge and his best friend Patrick navigate life in the underwater city of Bikini Bottom. Absurdist, sharp, and secretly philosophical.",
    icon: "🧽",
    accentColor: "#f5c518",
    bgGradient:
      "linear-gradient(135deg, #1a3a5c 0%, #0a1a2e 60%, #141414 100%)",
    maturityRating: "TV-Y7",
  },
  {
    id: "rugrats",
    title: "Rugrats",
    era: "Childhood",
    years: "1991–2004",
    genre: "Animated Adventure",
    rating: "9",
    memory:
      "Tommy Pickles taught me being brave doesn't mean not being scared. Angelica was my villain origin story.",
    synopsis:
      "A group of toddlers explore the world from a baby's-eye view. Equal parts heartwarming and completely unhinged.",
    icon: "👶",
    accentColor: "#e8a020",
    bgGradient:
      "linear-gradient(135deg, #3a1a00 0%, #1a0a00 60%, #141414 100%)",
    maturityRating: "TV-Y7",
  },
  {
    id: "heyarnold",
    title: "Hey Arnold!",
    era: "Childhood",
    years: "1996–2004",
    genre: "Animated Drama",
    rating: "9",
    memory:
      "Hey Arnold dealt with poverty, absent parents, and loneliness in ways that hit completely different rewatching as an adult.",
    synopsis:
      "A football-headed kid with a big heart navigates life in an inner-city neighborhood full of lovable misfits. Way more emotionally complex than it had any right to be.",
    icon: "🏙️",
    accentColor: "#4a90d9",
    bgGradient:
      "linear-gradient(135deg, #0a1a3a 0%, #050d1a 60%, #141414 100%)",
    maturityRating: "TV-Y7",
  },
  {
    id: "proudfamily",
    title: "The Proud Family",
    era: "Childhood",
    years: "2001–2005",
    genre: "Animated Comedy",
    rating: "9",
    memory:
      "Penny Proud was the blueprint. The Proud Family Movie was an EVENT. This show meant everything to little me.",
    synopsis:
      "Penny Proud navigates teenage life with an overprotective dad, a supportive mom, and a chaotic but loving family. Black excellence animated.",
    icon: "👑",
    accentColor: "#cc44aa",
    bgGradient:
      "linear-gradient(135deg, #2a0a2a 0%, #1a051a 60%, #141414 100%)",
    maturityRating: "TV-G",
  },
  {
    id: "naruto",
    title: "Naruto",
    era: "Anime",
    years: "2002–2007",
    genre: "Shonen / Action",
    rating: "10",
    memory:
      "Rock Lee removing his weights is the most hype moment I have ever seen on television. The chunin exams arc literally changed my life.",
    synopsis:
      "A hyperactive ninja dreams of becoming Hokage while carrying the burden of a sealed nine-tailed fox demon. About loneliness, hard work, and never giving up.",
    icon: "🍥",
    accentColor: "#ff6600",
    bgGradient:
      "linear-gradient(135deg, #2a1000 0%, #1a0800 60%, #141414 100%)",
    maturityRating: "TV-PG",
  },
  {
    id: "bleach",
    title: "Bleach",
    era: "Anime",
    years: "2004–2012",
    genre: "Shonen / Action",
    rating: "9",
    memory:
      "Ichigo's hollow mask reveal. The Soul Society arc. Byakuya vs Ichigo. TYBW finally gave us the ending this series deserved.",
    synopsis:
      "A teenager gains Soul Reaper powers and must defend the living world from malevolent spirits. Known for incredible fights and unmatched drip.",
    icon: "⚔️",
    accentColor: "#8888ff",
    bgGradient:
      "linear-gradient(135deg, #05051a 0%, #020210 60%, #141414 100%)",
    maturityRating: "TV-14",
  },
  {
    id: "dbz",
    title: "Dragon Ball Z",
    era: "Anime",
    years: "1989–1996",
    genre: "Shonen / Action",
    rating: "10",
    memory:
      "Coming home from school and catching DBZ on Cartoon Network. Gohan going SSJ2 against Cell is the greatest power-up sequence ever animated.",
    synopsis:
      "Goku and his friends defend Earth from increasingly powerful threats while pushing the limits of Saiyan potential. The godfather of shonen anime.",
    icon: "💥",
    accentColor: "#ff8800",
    bgGradient:
      "linear-gradient(135deg, #2a1500 0%, #1a0d00 60%, #141414 100%)",
    maturityRating: "TV-PG",
  },
  {
    id: "breakingbad",
    title: "Breaking Bad",
    era: "Adult Dramas",
    years: "2008–2013",
    genre: "Crime Drama",
    rating: "10",
    memory:
      "Watched the entire series in four days. Mr. White to Heisenberg is the greatest character arc in television history. Period.",
    synopsis:
      "A chemistry teacher diagnosed with cancer turns to manufacturing methamphetamine. A masterclass in dramatic writing and moral deterioration.",
    icon: "⚗️",
    accentColor: "#88cc22",
    bgGradient:
      "linear-gradient(135deg, #0a1500 0%, #060d00 60%, #141414 100%)",
    maturityRating: "TV-MA",
  },
  {
    id: "thewire",
    title: "The Wire",
    era: "Adult Dramas",
    years: "2002–2008",
    genre: "Crime Drama",
    rating: "10",
    memory:
      "Omar Little is one of the greatest characters ever written. The Wire doesn't have villains — it has systems. That shifted how I see the world.",
    synopsis:
      "A sprawling examination of the drug trade, policing, politics, education, and media in Baltimore. The most honest show about American cities ever made.",
    icon: "📡",
    accentColor: "#6688aa",
    bgGradient:
      "linear-gradient(135deg, #05080f 0%, #020508 60%, #141414 100%)",
    maturityRating: "TV-MA",
  },
  {
    id: "ozark",
    title: "Ozark",
    era: "Adult Dramas",
    years: "2017–2022",
    genre: "Crime Thriller",
    rating: "9",
    memory:
      "Ruth Langmore deserved everything and got robbed. Watched this in a week and was furious about it for another week after.",
    synopsis:
      "A financial advisor relocates his family to the Ozarks after a money-laundering scheme goes wrong. Crime, survival, and a marriage held together by chaos.",
    icon: "💰",
    accentColor: "#4488cc",
    bgGradient:
      "linear-gradient(135deg, #050a18 0%, #020508 60%, #141414 100%)",
    maturityRating: "TV-MA",
  },
];

const ERAS: Era[] = ["Childhood", "Anime", "Adult Dramas"];
const ERA_LABELS: Record<Era, string> = {
  Childhood: "📺 Childhood Classics",
  Anime: "⛩️ Anime",
  "Adult Dramas": "🎬 Adult Dramas",
};

// ─── ta-dum sound ─────────────────────────────────────────────────────────────
function playTaDum() {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const boom = (freq: number, t: number, dur: number, vol: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const dist = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = ((Math.PI + 300) * x) / (Math.PI + 300 * Math.abs(x));
      }
      dist.curve = curve;
      osc.connect(dist);
      dist.connect(g);
      g.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      const now = ctx.currentTime + t;
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    };
    boom(55, 0.0, 0.5, 0.55);
    boom(110, 0.0, 0.5, 0.28);
    boom(49, 0.48, 0.65, 0.75);
    boom(98, 0.48, 0.65, 0.32);
  } catch {
    /* silent fail */
  }
}

// ─── Show Card ────────────────────────────────────────────────────────────────
function ShowCard({
  show,
  onSelect,
  isSelected,
}: {
  show: Show;
  onSelect: (s: Show) => void;
  isSelected: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isSelected;

  return (
    <div
      onClick={() => onSelect(show)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 112,
        flexShrink: 0,
        cursor: "pointer",
        transform: active ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.18s ease, z-index 0s",
        zIndex: active ? 3 : 1,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 112,
          height: 64,
          background: show.bgGradient,
          border: isSelected
            ? `2px solid ${show.accentColor}`
            : active
              ? "2px solid rgba(255,255,255,0.5)"
              : "2px solid transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: active
            ? `0 4px 20px rgba(0,0,0,0.9), 0 0 12px ${show.accentColor}44`
            : "0 2px 6px rgba(0,0,0,0.5)",
        }}
      >
        <span
          style={{
            fontSize: 30,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.9))",
          }}
        >
          {show.icon}
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: show.accentColor,
            opacity: active ? 1 : 0.3,
            transition: "opacity 0.15s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 3,
            right: 3,
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff",
            fontSize: 7,
            padding: "0 3px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {show.maturityRating}
        </div>
        {/* Hover overlay */}
        {active && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                color: "#000",
                fontWeight: "bold",
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            >
              ▶
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 10,
          color: active ? "#fff" : "#999",
          fontFamily: "Arial, Helvetica, sans-serif",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "center",
          transition: "color 0.12s",
        }}
      >
        {show.title}
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ show, onPlay }: { show: Show; onPlay: (s: Show) => void }) {
  return (
    <div
      style={{
        height: 190,
        background: show.bgGradient,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        transition: "background 0.4s ease",
      }}
    >
      {/* Ambient radial */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "35%",
          transform: "translate(-50%,-50%)",
          width: 280,
          height: 200,
          background: `radial-gradient(ellipse, ${show.accentColor}25 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      {/* Big background icon */}
      <div
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 80,
          opacity: 0.18,
          filter: `drop-shadow(0 0 30px ${show.accentColor})`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {show.icon}
      </div>
      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          background: "linear-gradient(to bottom, transparent, #141414)",
          pointerEvents: "none",
        }}
      />
      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "18px 20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: show.accentColor,
            color: "#000",
            fontSize: 9,
            fontWeight: "bold",
            padding: "1px 7px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 6,
            width: "fit-content",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {show.era}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "Arial Black, Impact, sans-serif",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
            marginBottom: 5,
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            maxWidth: "68%",
          }}
        >
          {show.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: "#46d369",
              fontSize: 11,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
            }}
          >
            ★ {show.rating}/10
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 10,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {show.years}
          </span>
          <span
            style={{
              border: "1px solid rgba(255,255,255,0.35)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 9,
              padding: "0 4px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {show.maturityRating}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onPlay(show)}
            style={{
              background: "#fff",
              color: "#000",
              border: "none",
              padding: "5px 18px",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
              cursor: "pointer",
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            ▶ Play
          </button>
          <button
            style={{
              background: "rgba(109,109,110,0.7)",
              color: "#fff",
              border: "none",
              padding: "5px 16px",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Now Playing ──────────────────────────────────────────────────────────────
function NowPlaying({ show, onBack }: { show: Show; onBack: () => void }) {
  const [phase, setPhase] = useState<"logo" | "playing">("logo");

  useEffect(() => {
    const t = setTimeout(() => setPhase("playing"), 1900);
    return () => clearTimeout(t);
  }, []);

  if (phase === "logo") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <style>{`
          @keyframes nfPop {
            0%   { transform: scale(0.4); opacity:0 }
            55%  { transform: scale(1.14); opacity:1 }
            78%  { transform: scale(0.95) }
            100% { transform: scale(1) }
          }
        `}</style>
        <div
          style={{
            fontFamily: "Arial Black, Impact, sans-serif",
            fontSize: 80,
            fontWeight: 900,
            color: "#e50914",
            letterSpacing: "-5px",
            textShadow: "4px 4px 0 #8b0000, 0 0 50px rgba(229,9,20,0.6)",
            animation: "nfPop 1.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
            lineHeight: 1,
          }}
        >
          N
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 9,
            letterSpacing: "0.55em",
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
          }}
        >
          Netflix 95
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: show.bgGradient,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Arial, Helvetica, sans-serif",
        animation: "nfFadeIn 0.5s ease",
        position: "relative",
      }}
    >
      <style>{`@keyframes nfFadeIn { from { opacity:0 } to { opacity:1 } }`}</style>

      {/* Ambient */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 500,
          height: 300,
          background: `radial-gradient(ellipse, ${show.accentColor}1a 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)",
          flexShrink: 0,
          zIndex: 2,
          position: "relative",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: "Arial Black, Impact, sans-serif",
            fontSize: 18,
            fontWeight: 900,
            color: "#e50914",
            letterSpacing: "-1px",
            textShadow: "2px 2px 0 #8b0000",
          }}
        >
          NETFLIX
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={onBack}
          style={{
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff",
            fontSize: 10,
            padding: "3px 12px",
            cursor: "pointer",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          ✕ EXIT
        </button>
      </div>

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 18px 20px",
          zIndex: 1,
          position: "relative",
        }}
      >
        {/* Show title block */}
        <div style={{ textAlign: "center", padding: "10px 0 14px" }}>
          <div
            style={{
              fontSize: 52,
              filter: `drop-shadow(0 0 24px ${show.accentColor})`,
              marginBottom: 10,
            }}
          >
            {show.icon}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "Arial Black, Impact, sans-serif",
              letterSpacing: "-0.3px",
              textShadow: `0 0 30px ${show.accentColor}66`,
              marginBottom: 8,
            }}
          >
            {show.title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ color: "#46d369", fontSize: 11, fontWeight: "bold" }}
            >
              ★ {show.rating}/10 Match
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
              {show.years}
            </span>
            <span
              style={{
                border: "1px solid rgba(255,255,255,0.35)",
                color: "rgba(255,255,255,0.55)",
                fontSize: 9,
                padding: "0 4px",
              }}
            >
              {show.maturityRating}
            </span>
            <span
              style={{
                background: show.accentColor,
                color: "#000",
                fontSize: 9,
                padding: "1px 6px",
                fontWeight: "bold",
                letterSpacing: "0.1em",
              }}
            >
              {show.era.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Video player mock */}
        <div
          style={{
            background: "#000",
            border: `1px solid ${show.accentColor}33`,
            marginBottom: 16,
            position: "relative",
            height: 84,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
              pointerEvents: "none",
            }}
          />
          <span style={{ fontSize: 30, opacity: 0.12, position: "absolute" }}>
            {show.icon}
          </span>
          {/* Play button */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#000",
              zIndex: 1,
              boxShadow: `0 0 20px ${show.accentColor}55`,
            }}
          >
            ▶
          </div>
          {/* Progress */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <div
              style={{
                height: 3,
                background: "rgba(255,255,255,0.15)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "38%",
                  background: `linear-gradient(90deg, #e50914, ${show.accentColor})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "38%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#fff",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 8px",
                fontSize: 8,
                color: "rgba(255,255,255,0.45)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <span>19:42</span>
              <span>S1:E1</span>
              <span>44:00</span>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <p
          style={{
            color: "rgba(255,255,255,0.82)",
            fontSize: 11,
            lineHeight: 1.72,
            margin: "0 0 14px",
          }}
        >
          {show.synopsis}
        </p>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(to right, transparent, ${show.accentColor}55, transparent)`,
            marginBottom: 14,
          }}
        />

        {/* My Take */}
        <div
          style={{
            background: "rgba(0,0,0,0.45)",
            border: `1px solid ${show.accentColor}2a`,
            padding: "10px 12px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              color: show.accentColor,
              fontSize: 9,
              fontWeight: "bold",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            📝 MY TAKE
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: 11,
              lineHeight: 1.72,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            "{show.memory}"
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {show.genre.split(" / ").map((g) => (
            <span
              key={g}
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.55)",
                fontSize: 10,
                padding: "2px 8px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NetflixWindow() {
  const [heroShow, setHeroShow] = useState<Show>(SHOWS[4]); // Naruto as default hero
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [nowPlaying, setNowPlaying] = useState<Show | null>(null);
  const [soundPlayed, setSoundPlayed] = useState(false);

  const handlePlay = (show: Show) => {
    if (!soundPlayed) {
      playTaDum();
      setSoundPlayed(true);
    }
    setNowPlaying(show);
  };

  const handleSelect = (show: Show) => {
    setSelectedShow(show);
    setHeroShow(show);
  };

  if (nowPlaying) {
    return <NowPlaying show={nowPlaying} onBack={() => setNowPlaying(null)} />;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#141414",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Netflix nav */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.85) 100%)",
          padding: "7px 16px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexShrink: 0,
          borderBottom: "1px solid rgba(229,9,20,0.25)",
        }}
      >
        <div
          style={{
            fontFamily: "Arial Black, Impact, sans-serif",
            fontSize: 19,
            fontWeight: 900,
            color: "#e50914",
            letterSpacing: "-1px",
            textShadow: "2px 2px 0 #8b0000",
            flexShrink: 0,
          }}
        >
          NETFLIX
        </div>
        {["Home", "TV Shows", "Movies", "My List"].map((link, i) => (
          <span
            key={link}
            style={{
              color: i === 0 ? "#fff" : "rgba(255,255,255,0.55)",
              fontSize: 11,
              cursor: "pointer",
              fontWeight: i === 0 ? "bold" : "normal",
              whiteSpace: "nowrap",
            }}
          >
            {link}
          </span>
        ))}
        <div style={{ flex: 1 }} />
        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          🔍
        </span>
        <div
          style={{
            width: 26,
            height: 26,
            background: "linear-gradient(135deg, #e50914, #8b0000)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 0 8px rgba(229,9,20,0.4)",
          }}
        >
          T
        </div>
      </div>

      {/* Scrollable area */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <Hero show={heroShow} onPlay={handlePlay} />

        {/* Rows */}
        <div style={{ padding: "4px 0 16px" }}>
          {ERAS.map((era) => {
            const eraShows = SHOWS.filter((s) => s.era === era);
            return (
              <div key={era} style={{ marginBottom: 22 }}>
                {/* Row label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0 16px",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    {ERA_LABELS[era]}
                  </span>
                  <span
                    style={{
                      color: "#46d369",
                      fontSize: 10,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Explore All
                  </span>
                </div>

                {/* Cards row */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    overflowX: "auto",
                    padding: "6px 16px 10px",
                    scrollbarWidth: "none",
                  }}
                >
                  <style>{`div::-webkit-scrollbar{display:none}`}</style>
                  {eraShows.map((show) => (
                    <ShowCard
                      key={show.id}
                      show={show}
                      onSelect={handleSelect}
                      isSelected={selectedShow?.id === show.id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected show detail panel */}
        {selectedShow && (
          <div
            style={{
              margin: "0 16px 20px",
              background: "#1f1f1f",
              border: `1px solid ${selectedShow.accentColor}40`,
              padding: "14px 16px",
              animation: "nfSlideUp 0.2s ease",
            }}
          >
            <style>{`@keyframes nfSlideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 30 }}>{selectedShow.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 14,
                    marginBottom: 3,
                  }}
                >
                  {selectedShow.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      color: "#46d369",
                      fontSize: 11,
                      fontWeight: "bold",
                    }}
                  >
                    ★ {selectedShow.rating}/10
                  </span>
                  <span
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  >
                    {selectedShow.years}
                  </span>
                  <span
                    style={{
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 9,
                      padding: "0 3px",
                    }}
                  >
                    {selectedShow.maturityRating}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handlePlay(selectedShow)}
                style={{
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  padding: "5px 16px",
                  fontSize: 11,
                  fontWeight: "bold",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ▶ Play
              </button>
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.68)",
                fontSize: 11,
                lineHeight: 1.65,
                margin: "0 0 10px",
              }}
            >
              {selectedShow.synopsis}
            </p>

            <div
              style={{
                borderTop: `1px solid ${selectedShow.accentColor}2a`,
                paddingTop: 8,
              }}
            >
              <span
                style={{
                  color: selectedShow.accentColor,
                  fontSize: 9,
                  fontWeight: "bold",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                MY TAKE:{" "}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 11,
                  fontStyle: "italic",
                }}
              >
                "{selectedShow.memory}"
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.15)",
            fontSize: 9,
            letterSpacing: "0.1em",
            padding: "0 0 16px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          NETFLIX 95 · {SHOWS.length} TITLES · TAAHIRAH'S WATCHLIST
        </div>
      </div>
    </div>
  );
}
