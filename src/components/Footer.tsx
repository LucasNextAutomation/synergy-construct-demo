export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e8eaed",
        padding: "40px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Built by{" "}
          <span style={{ color: "#E31E24", fontWeight: 600 }}>NextAutomation</span>
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          <a
            href="https://nextautomation.us"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#94a3b8", textDecoration: "none" }}
          >
            nextautomation.us
          </a>
          <span>·</span>
          <span>© 2026 NextAutomation</span>
        </div>
      </div>
    </footer>
  )
}
