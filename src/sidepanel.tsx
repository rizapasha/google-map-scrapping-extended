import { useState } from "react"

function IndexSidePanel() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>Scraper Settings</h2>
      <p>Configure your scraping parameters here.</p>
      
      <div style={{ marginTop: 16 }}>
        <label>Keyword: </label>
        <input 
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="e.g., Restaurants" 
        />
      </div>

      <button style={{ marginTop: 16 }}>Start Scraping</button>
      
      <div style={{ marginTop: 32 }}>
        <a href={chrome.runtime.getURL("options.html")} target="_blank">
          Open Results Page
        </a>
      </div>
    </div>
  )
}

export default IndexSidePanel
