import { useMemo, useState } from 'react'
import './App.css'

const library = [
  {
    id: 'one',
    title: 'One',
    artist: 'U2',
    album: 'Achtung Baby',
    genre: 'Rock',
    accent: '#ff281f',
    poster:
      'linear-gradient(135deg, #0b0b0c 0%, #171214 26%, #24150f 50%, #0a0a0b 100%)',
  },
  {
    id: 'sometimes',
    title: 'Sometimes',
    artist: 'Britney Spears',
    album: 'Baby One More Time',
    genre: 'Pop',
    accent: '#ff5c74',
    poster:
      'linear-gradient(135deg, #f7d6cb 0%, #e9a58f 25%, #7f5a54 60%, #1d1111 100%)',
  },
  {
    id: 'yellow',
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
    genre: 'Alternative',
    accent: '#ffcc4d',
    poster:
      'linear-gradient(135deg, #f8edcf 0%, #d3af56 26%, #604d1f 60%, #141010 100%)',
  },
  {
    id: 'halo',
    title: 'Halo',
    artist: 'Beyonce',
    album: 'I Am... Sasha Fierce',
    genre: 'R&B',
    accent: '#9ecbff',
    poster:
      'linear-gradient(135deg, #e8f0ff 0%, #89a5d8 28%, #2c2c3e 60%, #09090b 100%)',
  },
]

function App() {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState('one')

  const filteredTracks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return library
    }

    return library.filter((track) => {
      return [track.title, track.artist, track.album, track.genre]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [query])

  const activeTrack =
    filteredTracks.find((track) => track.id === activeId) ?? filteredTracks[0] ?? library[0]

  const recommendedTracks = filteredTracks.filter((track) => track.id !== activeTrack.id)

  return (
    <div className="app-shell" style={{ '--accent': activeTrack.accent }}>
      <aside className="sidebar">
        <div className="brand-lockup">
          <span className="brand-wordmark">SONG UI</span>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          <a className="nav-item active" href="/">
            <span className="nav-icon">⌂</span>
            <span>Home</span>
          </a>
          <a className="nav-item" href="/">
            <span className="nav-icon">◔</span>
            <span>Trending</span>
          </a>
          <a className="nav-item" href="/">
            <span className="nav-icon">♪</span>
            <span>Music</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <p>Search like YouTube, then click a card in Recommended to play.</p>
        </div>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <label className="searchbar" htmlFor="music-search">
            <span aria-hidden="true" className="search-icon">
              ⌕
            </span>
            <input
              id="music-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
            />
          </label>
        </header>

        <section className="player-grid">
          <article className="featured-panel">
            <div className="featured-head">
              <div>
                <h1>{activeTrack.title}</h1>
                <p>
                  {activeTrack.artist} • {activeTrack.album} • {activeTrack.genre}
                </p>
              </div>

              <a
                className="open-pill"
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${activeTrack.artist} ${activeTrack.title}`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                OPEN
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <button
              className="player-frame"
              type="button"
              onClick={() => {
                window.open(
                  `https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `${activeTrack.artist} ${activeTrack.title}`,
                  )}`,
                  '_blank',
                  'noreferrer',
                )
              }}
              style={{ '--poster': activeTrack.poster }}
              aria-label={`Open ${activeTrack.title} by ${activeTrack.artist}`}
            >
              <div className="poster-overlay" />
              <div className="poster-sheen" />
              <div className="poster-label">
                <span className="mini-brand">vevo</span>
                <span className="video-title">
                  {activeTrack.artist} - {activeTrack.title}
                </span>
                <span className="watch-tag">Watch on YouTube</span>
              </div>
              <div className="play-button" aria-hidden="true">
                <span />
              </div>
            </button>

            <div className="track-details">
              <h2>{activeTrack.title}</h2>
              <p>
                {activeTrack.artist} • {activeTrack.album} • {activeTrack.genre}
              </p>
            </div>
          </article>

          <aside className="recommended-panel">
            <h2>Recommended</h2>

            <div className="recommend-list">
              {recommendedTracks.map((track) => (
                <button
                  key={track.id}
                  className="recommend-card"
                  type="button"
                  onClick={() => setActiveId(track.id)}
                >
                  <div className="recommend-art" style={{ '--poster': track.poster }}>
                    <div className="poster-overlay" />
                    <div className="poster-sheen" />
                    <span className="recommend-logo">vevo</span>
                  </div>

                  <div className="recommend-copy">
                    <strong>{track.title}</strong>
                    <span>{track.artist}</span>
                    <small>
                      {track.album} • {track.genre}
                    </small>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
