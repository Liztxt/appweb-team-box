export default function Skeleton({ width = '100%', height = '16px', borderRadius = '6px', style = {} }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #E2E8F0 25%, #F0F4F8 50%, #E2E8F0 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite linear;
        }
      `}</style>
      <div className='skeleton' style={{ width, height, borderRadius, ...style }} />
    </>
  )
}