import { useEffect, useState } from 'react'

const ICONOS = {
  0: { icono: '☀️', desc: 'Despejado' },
  1: { icono: '🌤️', desc: 'Mayormente despejado' },
  2: { icono: '⛅', desc: 'Parcialmente nublado' },
  3: { icono: '☁️', desc: 'Nublado' },
  45: { icono: '🌫️', desc: 'Niebla' },
  48: { icono: '🌫️', desc: 'Niebla' },
  51: { icono: '🌦️', desc: 'Llovizna' },
  61: { icono: '🌧️', desc: 'Lluvia' },
  63: { icono: '🌧️', desc: 'Lluvia moderada' },
  65: { icono: '🌧️', desc: 'Lluvia intensa' },
  80: { icono: '🌦️', desc: 'Chubascos' },
  95: { icono: '⛈️', desc: 'Tormenta' },
}

export default function ClimaWidget() {
  const [clima, setClima] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=25.6714&longitude=-100.4609&current=temperature_2m,weathercode,windspeed_10m&temperature_unit=celsius&timezone=America%2FMonterrey')
      .then(res => res.json())
      .then(data => {
        const codigo = data.current.weathercode
        setClima({
          temp: Math.round(data.current.temperature_2m),
          viento: Math.round(data.current.windspeed_10m),
          icono: ICONOS[codigo]?.icono || '🌡️',
          desc: ICONOS[codigo]?.desc || 'Variable'
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '6px 10px', background: '#F0F4F8',
      borderRadius: '8px', fontSize: '12px', color: '#64748B'
    }}>
      Cargando clima...
    </div>
  )

  if (!clima) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '6px 12px', background: '#F0F4F8',
      borderRadius: '8px', border: '0.5px solid #E2E8F0'
    }}>
      <span style={{ fontSize: '18px' }}>{clima.icono}</span>
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
          {clima.temp}°C
        </div>
        <div style={{ fontSize: '10px', color: '#64748B' }}>
          {clima.desc} · Santa Catarina
        </div>
      </div>
    </div>
  )
}