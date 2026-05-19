import { useState, useEffect } from "react"

const SB_URL = import.meta.env.VITE_SUPABASE_URL
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
}

async function fetchAssignment(code) {
  const res = await fetch(
    `${SB_URL}/rest/v1/assignments?code=eq.${code}&select=scenario_ids`,
    { headers }
  )
  const data = await res.json()
  return data[0]?.scenario_ids || null
}

async function fetchScenarios(ids) {
  const res = await fetch(
    `${SB_URL}/rest/v1/scenarios?id=in.(${ids.join(",")})&select=*&order=id`,
    { headers }
  )
  return res.json()
}

async function submitResponses(code, region, answers) {
  const rows = answers.map((a) => ({
    code,
    scenario_id: a.scenario_id,
    choice: a.choice,
    region,
  }))
  const res = await fetch(`${SB_URL}/rest/v1/responses`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify(rows),
  })
  return res.ok
}

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Be Vietnam Pro', sans-serif;
    background: #f7f5f2;
    color: #1a1a1a;
    min-height: 100vh;
  }

  .container {
    max-width: 680px;
    margin: 0 auto;
    padding: 24px 16px 80px;
  }

  .header {
    text-align: center;
    padding: 32px 0 24px;
    border-bottom: 2px solid #1a1a1a;
    margin-bottom: 32px;
  }

  .header h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .header p  { font-size: 13px; color: #666; margin-top: 6px; }

  .progress-wrap { margin-bottom: 28px; }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .progress-bar {
    height: 4px;
    background: #e0ddd8;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #1a1a1a;
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  .card {
    background: #fff;
    border: 1.5px solid #e0ddd8;
    border-radius: 12px;
    padding: 28px 24px;
    margin-bottom: 20px;
  }

  .topic-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #888;
    margin-bottom: 12px;
  }

  .scenario-title {
    font-size: 17px;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 16px;
    color: #111;
  }

  .scenario-prompt {
    font-size: 14px;
    line-height: 1.7;
    color: #333;
    border-left: 3px solid #e0ddd8;
    padding-left: 14px;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 24px;
  }

  .option-btn {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 18px;
    border: 1.5px solid #e0ddd8;
    border-radius: 10px;
    background: #fafafa;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
    font-family: inherit;
  }

  .option-btn:hover        { border-color: #1a1a1a; background: #f7f5f2; }
  .option-btn.selected     { border-color: #1a1a1a; background: #1a1a1a; color: #fff; }

  .option-letter {
    font-size: 13px;
    font-weight: 700;
    min-width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    opacity: 0.7;
  }

  .option-btn.selected .option-letter { opacity: 1; border-color: #fff; }
  .option-text {
    font-size: 13px;
    line-height: 1.7;
  }

  .option-text em {
    font-style: normal;
    font-weight: 600;
    color: inherit;
    opacity: 0.75;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-top: 8px;
  }

  .option-btn.selected .option-text em {
    opacity: 0.6;
  }

  .action-text {
    display: block;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .consequence {
    display: block;
    font-size: 12px;
    line-height: 1.6;
    padding: 8px 10px;
    border-radius: 6px;
    margin-top: 6px;
    color: #444;
  }

  .option-btn.selected .consequence {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.08);
  }

  .consequence.good {
    background: rgba(0, 0, 0, 0.04);
    border-left: 3px solid #27ae60;
  }

  .consequence.bad {
    background: rgba(0, 0, 0, 0.04);
    border-left: 3px solid #e74c3c;
  }

  .consequence-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
    opacity: 0.6;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
  }

  .btn {
    padding: 12px 28px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid #1a1a1a;
    font-family: inherit;
    transition: all 0.15s;
  }

  .btn-primary              { background: #1a1a1a; color: #fff; }
  .btn-primary:hover:not(:disabled) { background: #333; }
  .btn-primary:disabled     { opacity: 0.35; cursor: not-allowed; }
  .btn-ghost                { background: transparent; color: #1a1a1a; }
  .btn-ghost:hover          { background: #f0ede9; }

  .center-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    text-align: center;
  }

  .center-page h2 { font-size: 26px; font-weight: 700; margin-bottom: 8px; }

  .center-page p {
    font-size: 14px;
    color: #666;
    margin-bottom: 32px;
    max-width: 360px;
    line-height: 1.6;
  }

  .code-input {
    width: 220px;
    padding: 14px 18px;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 3px;
    text-align: center;
    border: 2px solid #1a1a1a;
    border-radius: 10px;
    font-family: inherit;
    margin-bottom: 16px;
    text-transform: uppercase;
    outline: none;
  }

  .code-input:focus { border-color: #555; }
  .error-msg { color: #c0392b; font-size: 13px; margin-top: 8px; }

  .region-card {
    background: #fff;
    border: 1.5px solid #e0ddd8;
    border-radius: 12px;
    padding: 32px 24px;
    text-align: center;
  }

  .region-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .region-card p  { font-size: 13px; color: #888; margin-bottom: 24px; }

  .region-options {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .region-btn {
    padding: 12px 28px;
    border: 1.5px solid #e0ddd8;
    border-radius: 8px;
    background: #fafafa;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }

  .region-btn:hover, .region-btn.selected {
    border-color: #1a1a1a;
    background: #1a1a1a;
    color: #fff;
  }

  .done-icon { font-size: 56px; margin-bottom: 16px; }

  .done-card {
    background: #fff;
    border: 1.5px solid #e0ddd8;
    border-radius: 12px;
    padding: 48px 32px;
    text-align: center;
  }

  .done-card h2 { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
  .done-card p  { font-size: 14px; color: #666; line-height: 1.6; }

  @media (max-width: 480px) {
    .card            { padding: 20px 16px; }
    .scenario-title  { font-size: 15px; }
    .option-text     { font-size: 12px; }
    .btn             { padding: 11px 20px; font-size: 13px; }
  }
`

export default function App() {
  const [phase, setPhase]         = useState("loading")
  const [code, setCode]           = useState("")
  const [codeInput, setCodeInput] = useState("")
  const [codeError, setCodeError] = useState("")
  const [region, setRegion]       = useState("")
  const [scenarios, setScenarios] = useState([])
  const [current, setCurrent]     = useState(0)
  const [answers, setAnswers]     = useState(() => {
    try {
      const saved = localStorage.getItem(`answers_${code}`)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  const [savedCurrent, setSavedCurrent] = useState(() => {
    try {
      return parseInt(localStorage.getItem(`current_${code}`)) || 0
    } catch { return 0 }
  })

  const [errorMsg, setErrorMsg]   = useState("")

  useEffect(() => {
    const params  = new URLSearchParams(window.location.search)
    const urlCode = params.get("code")?.toUpperCase()
    if (urlCode) {
      setCode(urlCode)
      loadSurvey(urlCode)
    } else {
      setPhase("code")
    }
  }, [])

  async function loadSurvey(c) {
    setPhase("loading")
    try {
      const ids = await fetchAssignment(c)
      if (!ids) {
        setCodeError("Mã không hợp lệ. Vui lòng kiểm tra lại.")
        setPhase("code")
        return
      }
      const data = await fetchScenarios(ids)
      if (!data || data.length === 0) {
        setErrorMsg("Không tải được câu hỏi. Thử lại sau.")
        setPhase("error")
        return
      }
      const shuffled = [...data].sort(() => Math.random() - 0.5)
      setScenarios(shuffled)
      const savedIdx = parseInt(localStorage.getItem(`current_${c}`)) || 0
      setCurrent(savedIdx)
      try {
        const savedAnswers = localStorage.getItem(`answers_${c}`)
        if (savedAnswers) setAnswers(JSON.parse(savedAnswers))
      } catch {}
      setPhase("region")
    } catch {
      setErrorMsg("Lỗi kết nối. Kiểm tra mạng và thử lại.")
      setPhase("error")
    }
  }

  function handleCodeSubmit() {
    setCodeError("")
    if (!codeInput.trim()) { setCodeError("Vui lòng nhập mã."); return }
    setCode(codeInput.trim())
    loadSurvey(codeInput.trim())
  }

  async function handleSubmit() {
    setPhase("submitting")
    const answerList = Object.entries(answers).map(([sid, choice]) => ({
      scenario_id: parseInt(sid),
      choice,
    }))
    const ok = await submitResponses(code, region, answerList)
    if (ok) {
      localStorage.removeItem(`answers_${code}`)
      localStorage.removeItem(`current_${code}`)
    }
    setPhase(ok ? "done" : "error")
    if (!ok) setErrorMsg("Lỗi khi gửi câu trả lời. Vui lòng thử lại.")
  }

  const currentScenario = scenarios[current]
  const totalAnswered   = Object.keys(answers).length
  const progress        = scenarios.length > 0 ? (current / scenarios.length) * 100 : 0

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="header">
          <h1>Khảo sát Đạo đức Giáo dục</h1>
          <p>Nghiên cứu học thuật – Đại học Công nghệ Thông tin</p>
        </div>

        {phase === "loading" && (
          <div className="center-page">
            <p>Đang tải...</p>
          </div>
        )}

        {phase === "code" && (
          <div className="center-page">
            <h2>Nhập mã tham gia</h2>
            <p>Bạn đã nhận được mã từ người tổ chức khảo sát. Nhập mã vào ô bên dưới để bắt đầu.</p>
            <input
              className="code-input"
              placeholder="VN001"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
              maxLength={6}
              autoFocus
            />
            {codeError && <p className="error-msg">{codeError}</p>}
            <br />
            <button className="btn btn-primary" onClick={handleCodeSubmit}>
              Bắt đầu →
            </button>
          </div>
        )}

        {phase === "region" && (
          <div className="region-card">
            <h3>Bạn lớn lên ở đâu?</h3>
            <p>Thông tin này giúp phân tích sự khác biệt vùng miền.</p>
            <div className="region-options">
              {["Miền Bắc", "Miền Trung", "Miền Nam"].map((r) => (
                <button
                  key={r}
                  className={`region-btn ${region === r ? "selected" : ""}`}
                  onClick={() => setRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            {region && (
              <div style={{ marginTop: 28 }}>
                <button className="btn btn-primary" onClick={() => setPhase("survey")}>
                  Tiếp tục →
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "survey" && currentScenario && (
          <>
            <div className="progress-wrap">
              <div className="progress-label">
                <span>Câu {current + 1} / {scenarios.length}</span>
                <span>{totalAnswered} đã trả lời</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="card">
              <span className="topic-tag">{currentScenario.topic}</span>
              <h2 className="scenario-title">{currentScenario.title}</h2>
              <p className="scenario-prompt">{currentScenario.neutral_prompt}</p>

              <div className="options">
                {["option_1", "option_2", "option_3"]
                  .filter((k) => currentScenario[k]?.trim())
                  .map((k, i) => {
                    const letter   = ["A", "B", "C"][i]
                    const selected = answers[currentScenario.id] === letter
                    return (
                      <button
                        key={letter}
                        className={`option-btn ${selected ? "selected" : ""}`}
                        onClick={() =>
                          setAnswers((prev) => {
                            const next = { ...prev, [currentScenario.id]: letter }
                            localStorage.setItem(`answers_${code}`, JSON.stringify(next))
                            return next
                          })
                        }
                      >
                        <span className="option-letter">{letter}</span>
                        <span className="option-text">
                          {(() => {
                            const text = currentScenario[k]
                            const parts = text.split(/\*Hệ quả tốt\*|\*HỆ QUẢ TỐT\*|HỆ QUẢ TỐT:|Hệ quả tốt:/)
                            const action = parts[0].trim()
                            const rest   = parts[1] || ""
                            const consequences = rest.split(/\*Hệ quả xấu\*|\*HỆ QUẢ XẤU\*|HỆ QUẢ XẤU:|Hệ quả xấu:/)
                            const good = consequences[0]?.trim()
                            const bad  = consequences[1]?.trim()
                            return (
                              <>
                                <span className="action-text">{action}</span>
                                {good && (
                                  <span className="consequence good">
                                    <span className="consequence-label">✓ Hệ quả tốt</span>
                                    {good}
                                  </span>
                                )}
                                {bad && (
                                  <span className="consequence bad">
                                    <span className="consequence-label">✗ Hệ quả xấu</span>
                                    {bad}
                                  </span>
                                )}
                              </>
                            )
                          })()}
                        </span>
                      </button>
                    )
                  })}
              </div>
            </div>

            <div className="nav">
              <button
                className="btn btn-ghost"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                style={{ visibility: current === 0 ? "hidden" : "visible" }}
              >
                ← Quay lại
              </button>

              {current < scenarios.length - 1 ? (
                <button
                  className="btn btn-primary"
                  disabled={!answers[currentScenario.id]}
                  onClick={() => {
                    const next = current + 1
                    setCurrent(next)
                    localStorage.setItem(`current_${code}`, next)
                  }}
                >
                  Tiếp theo →
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled={totalAnswered < scenarios.length}
                  onClick={handleSubmit}
                >
                  Gửi câu trả lời →
                </button>
              )}
            </div>

            {current === scenarios.length - 1 && totalAnswered < scenarios.length && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 12 }}>
                Còn {scenarios.length - totalAnswered} câu chưa trả lời
              </p>
            )}
          </>
        )}

        {phase === "submitting" && (
          <div className="center-page">
            <p>Đang gửi câu trả lời...</p>
          </div>
        )}

        {phase === "done" && (
          <div className="done-card">
            <div className="done-icon">🎉</div>
            <h2>Cảm ơn bạn!</h2>
            <p>
              Câu trả lời của bạn đã được ghi nhận.<br />
              Đây là đóng góp quan trọng cho nghiên cứu về AI và giáo dục Việt Nam.
            </p>
          </div>
        )}

        {phase === "error" && (
          <div className="center-page">
            <p style={{ color: "#c0392b" }}>{errorMsg}</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </>
  )
}
