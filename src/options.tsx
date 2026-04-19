import { useState } from "react"

function OptionsIndex() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        fontFamily: "sans-serif"
      }}>
      <h1>Scraped Results</h1>
      <p>Data will appear here after scraping.</p>
      
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Name</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Address</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} style={{ textAlign: "center", padding: 16, color: "#666" }}>
              No data available yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default OptionsIndex
