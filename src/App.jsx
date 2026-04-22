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
    videoId: 'ftjEcrrf7r0',
  },
  {
    id: 'sometimes',
    title: 'Sometimes',
    artist: 'Britney Spears',
    album: 'Baby One More Time',
    genre: 'Pop',
    accent: '#ff5c74',
    videoId: 't0bPrt69rag',
  },
  {
    id: 'sometimes-live',
    title: 'Sometimes (4K)',
    artist: 'Britney Spears',
    album: 'Baby One More Time',
    genre: 'Pop',
    accent: '#ff92a4',
    videoId: 'p-Cb7w-9QkU',
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

  const activeVideoUrl = `https://www.youtube.com/embed/${activeTrack.videoId}?autoplay=0&rel=0&modestbranding=1`

  const getThumbnailUrl = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

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

            <div
              className="player-frame"
              aria-label={`Embedded video for ${activeTrack.title} by ${activeTrack.artist}`}
            >
              <iframe
                className="video-embed"
                src={activeVideoUrl}
                title={`${activeTrack.artist} - ${activeTrack.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

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
                  <div className="recommend-art">
                    <img
                      className="recommend-thumb"
                      src={getThumbnailUrl(track.videoId)}
                      alt={`${track.title} thumbnail`}
                      loading="lazy"
                    />
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
