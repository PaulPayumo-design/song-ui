import { useEffect, useMemo, useState } from 'react'
import './App.css'

const fallbackLibrary = [
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
    title: 'Ligaya',
    artist: 'Eraserheads',
    album: 'Ultraelectromagneticpop!',
    genre: 'OPM',
    accent: '#f4a65d',
    videoId: 'XibB-5BPdrY',
  },
]

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'https://song-api.onrender.com'
const songsEndpoints = ['/api/songs', '/songs']

function extractYouTubeVideoId(rawValue) {
  if (!rawValue) {
    return ''
  }

  // Supports plain ids, youtu.be links, watch links, and embed links.
  const value = String(rawValue).trim()
  const idPattern = /^[a-zA-Z0-9_-]{11}$/

  if (idPattern.test(value)) {
    return value
  }

  try {
    const parsedUrl = new URL(value)

    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.replace('/', '').trim()
    }

    if (parsedUrl.searchParams.has('v')) {
      return parsedUrl.searchParams.get('v')?.trim() || ''
    }

    const embedMatch = parsedUrl.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/)
    return embedMatch?.[1] || ''
  } catch {
    return ''
  }
}

function normalizeSong(apiSong, index) {
  const id =
    apiSong.id ??
    apiSong.songId ??
    apiSong.uuid ??
    `${apiSong.title || apiSong.name || 'song'}-${index}`

  const title = apiSong.title || apiSong.name || apiSong.songTitle || 'Unknown Song'
  const artist = apiSong.artist || apiSong.artistName || 'Unknown Artist'
  const album = apiSong.album || apiSong.albumTitle || 'Unknown Album'
  const genre = apiSong.genre || apiSong.category || 'Music'

  const videoId = extractYouTubeVideoId(
    apiSong.videoId || apiSong.youtubeVideoId || apiSong.youtubeId || apiSong.youtubeUrl,
  )

  return {
    id: String(id),
    title,
    artist,
    album,
    genre,
    accent: '#ff281f',
    videoId,
  }
}

async function fetchSongsFromApi() {
  for (const endpoint of songsEndpoints) {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`)

      if (!response.ok) {
        continue
      }

      const payload = await response.json()
      const list =
        (Array.isArray(payload) && payload) ||
        (Array.isArray(payload?.data) && payload.data) ||
        (Array.isArray(payload?.content) && payload.content) ||
        []

      const normalizedSongs = list
        .map((song, index) => normalizeSong(song, index))
        .filter((song) => song.videoId)

      if (normalizedSongs.length > 0) {
        return normalizedSongs
      }
    } catch {
      // Try the next known endpoint.
    }
  }

  return []
}

function App() {
  const [tracks, setTracks] = useState(fallbackLibrary)
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(fallbackLibrary[0].id)
  const [apiStatus, setApiStatus] = useState('loading')

  useEffect(() => {
    let isMounted = true

    const loadSongs = async () => {
      const apiSongs = await fetchSongsFromApi()

      if (!isMounted) {
        return
      }

      if (apiSongs.length > 0) {
        setTracks(apiSongs)
        setActiveId(apiSongs[0].id)
        setApiStatus('connected')
      } else {
        setApiStatus('fallback')
      }
    }

    loadSongs()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredTracks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return tracks
    }

    return tracks.filter((track) => {
      return [track.title, track.artist, track.album, track.genre]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [query, tracks])

  const activeTrack =
    filteredTracks.find((track) => track.id === activeId) ?? filteredTracks[0] ?? tracks[0]

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
          <p>
            {apiStatus === 'connected'
              ? 'Connected to Song API.'
              : apiStatus === 'loading'
                ? 'Connecting to Song API...'
                : 'Song API unavailable. Showing fallback songs.'}
          </p>
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
