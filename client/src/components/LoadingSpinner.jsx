export default function LoadingSpinner() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(240, 244, 248, 0.7)',
      zIndex: 9999
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid #E2E8F0',
        borderTop: '3px solid #6366F1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}