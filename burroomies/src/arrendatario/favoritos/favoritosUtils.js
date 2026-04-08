const API = 'http://localhost:3001/api'
const token = () => localStorage.getItem('burroomies_token')

export async function getFavoritos() {
  try {
    const res = await fetch(`${API}/favoritos`, {
      headers: { Authorization: `Bearer ${token()}` },
    })
    return res.ok ? res.json() : []
  } catch { return [] }
}

export async function toggleFavorito(propiedad) {
  const favs = await getFavoritos()
  const yaEsta = favs.some(f => f.idPropiedad === propiedad.idPropiedad)
  await fetch(`${API}/favoritos/${propiedad.idPropiedad}`, {
    method: yaEsta ? 'DELETE' : 'POST',
    headers: { Authorization: `Bearer ${token()}` },
  })
  return !yaEsta
}

export async function esFavorito(idPropiedad) {
  const favs = await getFavoritos()
  return favs.some(f => f.idPropiedad === idPropiedad)
}
