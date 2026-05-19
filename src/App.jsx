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
  :root {
    --paper:      #f3ecd9;
    --paper-soft: #ebe2c9;
    --paper-deep: #e3d8b5;
    --ink:        #1a1d28;
    --ink-soft:   #4a4d58;
    --ink-faint:  #7a7665;
    --rule:       #b8ad8a;
    --rule-soft:  #d6cca9;
    --oxide:      #7a2922;
    --oxide-soft: #a44a40;
    --olive:      #3f5236;
    --shadow:     0 1px 0 rgba(26,29,40,.04), 0 18px 40px -28px rgba(26,29,40,.18);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: var(--paper); color: var(--ink); }
  body {
    font-family: 'Be Vietnam Pro', system-ui, sans-serif;
    line-height: 1.55;
    min-height: 100vh;
    background-image: radial-gradient(rgba(26,29,40,.035) 1px, transparent 1px);
    background-size: 4px 4px;
  }

  ::selection { background: var(--oxide); color: var(--paper); }

  .A-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.04em; }

  .A-root { min-height: 100vh; padding: 32px 24px 80px; }

  .A-page {
    max-width: 880px;
    margin: 0 auto;
    background: var(--paper);
    border: 1px solid var(--rule-soft);
    box-shadow: var(--shadow);
    position: relative;
  }
  .A-page::before, .A-page::after {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px solid var(--rule-soft);
    pointer-events: none;
    z-index: 0;
  }
  .A-page::after { inset: 12px; border-color: var(--paper-deep); }

  .A-masthead {
    padding: 36px 56px 24px;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .A-masthead__top {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    text-transform: uppercase;
    color: var(--ink-soft);
    border-bottom: 1px solid var(--rule);
    padding-bottom: 12px;
    margin-bottom: 24px;
  }
  .A-masthead__center { color: var(--oxide); font-weight: 600; }
  .A-masthead__title {
    font-family: 'Spectral', serif;
    font-weight: 600;
    font-size: clamp(40px, 8vw, 64px);
    line-height: 1;
    letter-spacing: -0.025em;
    margin-bottom: 14px;
    color: var(--ink);
  }
  .A-masthead__subtitle {
    font-family: 'Spectral', serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(15px, 2.4vw, 18px);
    color: var(--ink-soft);
    max-width: 540px;
    margin: 0 auto 22px;
    line-height: 1.5;
  }
  .A-masthead__byline {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--ink-faint);
    border-top: 1px solid var(--rule);
    padding-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    justify-content: center;
  }
  .A-masthead__sep { color: var(--rule); }
  .A-masthead__phase {
    font-size: 10px;
    color: var(--oxide);
    margin-top: 14px;
    text-transform: uppercase;
    font-weight: 500;
  }

  .A-stage { padding: 16px 56px 48px; position: relative; z-index: 1; }
  .A-stage--center {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .A-frame { width: 100%; max-width: 560px; text-align: center; padding: 24px 0; }
  .A-frame--done { padding-top: 12px; }

  .A-eyebrow {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--oxide);
    margin-bottom: 18px;
    display: inline-block;
    font-weight: 600;
  }
  .A-h-display {
    font-family: 'Spectral', serif;
    font-weight: 500;
    font-size: clamp(28px, 5vw, 38px);
    line-height: 1.15;
    letter-spacing: -0.015em;
    margin-bottom: 16px;
  }
  .A-lede {
    font-family: 'Spectral', serif;
    font-size: 16px;
    line-height: 1.65;
    color: var(--ink-soft);
    max-width: 480px;
    margin: 0 auto 28px;
  }

  .A-code-row {
    display: flex;
    gap: 12px;
    justify-content: center;
    align-items: stretch;
    margin: 28px 0 14px;
    flex-wrap: wrap;
  }
  .A-code-input {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-align: center;
    background: transparent;
    border: none;
    border-bottom: 2px solid var(--ink);
    padding: 14px 18px 10px;
    color: var(--ink);
    width: 220px;
    outline: none;
    text-transform: uppercase;
    transition: border-bottom-color 0.18s ease;
  }
  .A-code-input::placeholder { color: var(--ink-faint); opacity: 0.5; }
  .A-code-input:focus { border-bottom-color: var(--oxide); }

  .A-err { color: var(--oxide); font-size: 13px; margin-top: 8px; font-style: italic; }

  .A-footnote {
    font-family: 'Spectral', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--ink-faint);
    margin-top: 28px;
    line-height: 1.6;
    border-top: 1px solid var(--rule-soft);
    padding-top: 16px;
    max-width: 460px;
    margin-left: auto;
    margin-right: auto;
  }
  .A-footnote sup { color: var(--oxide); font-weight: 600; }
  .A-footnote em { font-style: italic; color: var(--ink); }

  .A-btn {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 14px 24px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: var(--paper);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.18s ease;
    border-radius: 0;
  }
  .A-btn:hover:not(:disabled) { background: var(--oxide); border-color: var(--oxide); }
  .A-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .A-btn--ghost { background: transparent; color: var(--ink); border-color: var(--rule); }
  .A-btn--ghost:hover:not(:disabled) { background: var(--paper-soft); border-color: var(--ink); color: var(--ink); }
  .A-btn__arrow { font-size: 16px; line-height: 1; }

  .A-region-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 28px 0;
  }
  .A-region {
    font-family: 'Be Vietnam Pro', sans-serif;
    background: transparent;
    border: 1px solid var(--rule);
    padding: 22px 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 8px;
    transition: all 0.18s ease;
    position: relative;
  }
  .A-region__key {
    font-size: 10px;
    color: var(--ink-faint);
    border: 1px solid var(--rule);
    padding: 2px 6px;
    font-weight: 500;
  }
  .A-region__label {
    font-family: 'Spectral', serif;
    font-size: 22px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.1;
  }
  .A-region__caption {
    font-family: 'Spectral', serif;
    font-style: italic;
    font-size: 12px;
    color: var(--ink-faint);
    line-height: 1.5;
  }
  .A-region:hover { border-color: var(--ink); }
  .A-region--on { border-color: var(--ink); background: var(--ink); }
  .A-region--on .A-region__label,
  .A-region--on .A-region__caption { color: var(--paper); }
  .A-region--on .A-region__key { color: var(--paper); border-color: var(--paper-soft); }
  .A-region-cta { margin-top: 8px; }

  .A-progress { margin-bottom: 28px; }
  .A-progress__meta {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin-bottom: 8px;
  }
  .A-progress__bar { height: 2px; background: var(--rule-soft); position: relative; }
  .A-progress__fill { height: 100%; background: var(--oxide); transition: width 0.4s ease; }

  .A-article {
    background: var(--paper-soft);
    border: 1px solid var(--rule);
    padding: 36px 36px 32px;
    margin-bottom: 20px;
    position: relative;
  }
  .A-article__head {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
  }
  .A-article__head .A-eyebrow { margin: 0; flex-shrink: 0; }
  .A-article__rule { flex: 1; height: 1px; background: var(--rule); }
  .A-article__title {
    font-family: 'Spectral', serif;
    font-weight: 500;
    font-size: clamp(22px, 3.4vw, 28px);
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin-bottom: 14px;
    color: var(--ink);
  }
  .A-article__prompt {
    font-family: 'Spectral', serif;
    font-size: 16px;
    line-height: 1.7;
    color: var(--ink-soft);
    border-left: 2px solid var(--oxide);
    padding-left: 18px;
    margin-bottom: 28px;
    font-style: italic;
  }
  .A-article__divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 28px 0 16px;
  }
  .A-article__divider::before,
  .A-article__divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--rule);
  }
  .A-article__divider span {
    font-size: 10px;
    color: var(--ink-faint);
    text-transform: uppercase;
  }

  .A-options { display: flex; flex-direction: column; gap: 12px; }
  .A-option {
    font-family: inherit;
    text-align: left;
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: 22px 24px;
    cursor: pointer;
    transition: all 0.18s ease;
    position: relative;
    color: var(--ink);
    width: 100%;
  }
  .A-option:hover { border-color: var(--ink); }
  .A-option--on {
    border-color: var(--ink);
    box-shadow: inset 0 0 0 1px var(--ink), 0 1px 0 rgba(26,29,40,.04);
  }
  .A-option--on::before {
    content: "✓";
    position: absolute;
    top: 18px;
    right: 22px;
    color: var(--oxide);
    font-size: 18px;
    font-weight: 700;
  }
  .A-option__head {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 18px;
    padding-bottom: 16px;
    border-bottom: 1px dashed var(--rule-soft);
  }
  .A-option__letter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    width: 26px;
    height: 26px;
    border: 1px solid var(--ink);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--ink);
    color: var(--paper);
    letter-spacing: 0;
  }
  .A-option--on .A-option__letter { background: var(--oxide); border-color: var(--oxide); }
  .A-option__action {
    font-family: 'Spectral', serif;
    font-size: 17px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--ink);
    padding-right: 28px;
  }

  .A-option__cols {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: 18px;
  }
  .A-conseq__sep { background: var(--rule-soft); }
  .A-conseq__label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.04em;
  }
  .A-conseq__mark {
    display: inline-flex;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 700;
  }
  .A-conseq--good .A-conseq__label { color: var(--olive); }
  .A-conseq--bad  .A-conseq__label { color: var(--oxide); }
  .A-conseq p {
    font-family: 'Spectral', serif;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--ink-soft);
  }

  .A-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 28px;
    gap: 12px;
  }
  .A-pending {
    text-align: center;
    color: var(--oxide);
    font-size: 11px;
    text-transform: uppercase;
    margin-top: 16px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
  }

  .A-seal { margin: 0 auto 24px; opacity: 0.85; display: block; }

  .A-foot {
    border-top: 1px solid var(--rule);
    padding: 18px 56px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    justify-content: center;
    font-size: 10px;
    text-transform: uppercase;
    color: var(--ink-faint);
    position: relative;
    z-index: 1;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
  }

  @media (max-width: 720px) {
    .A-root { padding: 16px 12px 48px; }
    .A-masthead { padding: 28px 24px 18px; }
    .A-masthead__top { font-size: 9px; }
    .A-stage { padding: 12px 20px 32px; }
    .A-article { padding: 24px 20px; }
    .A-option { padding: 18px 18px; }
    .A-option__head { gap: 12px; }
    .A-option--on::before { top: 14px; right: 16px; font-size: 16px; }
    .A-option__action { font-size: 15px; padding-right: 24px; }
    .A-option__cols { grid-template-columns: 1fr; gap: 14px; }
    .A-conseq__sep { height: 1px; width: 100%; background: var(--rule-soft); }
    .A-region-grid { grid-template-columns: 1fr; gap: 10px; }
    .A-region { padding: 16px; }
    .A-foot { padding: 16px 20px; font-size: 9px; }
    .A-page::before { inset: 4px; }
    .A-page::after { inset: 7px; }
  }
`

const urlCode = (new URLSearchParams(window.location.search)
  .get("code") || "").toUpperCase().replace(/-/g, "")

function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 2 ** 32
    const j = Math.abs(s) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function OrnamentRule() {
  return (
    <svg width="120" height="14" viewBox="0 0 120 14" style={{ display: "block", margin: "0 auto" }}>
      <line x1="0" y1="7" x2="48" y2="7" stroke="var(--rule)" strokeWidth="1" />
      <circle cx="60" cy="7" r="2" fill="var(--rule)" />
      <line x1="72" y1="7" x2="120" y2="7" stroke="var(--rule)" strokeWidth="1" />
    </svg>
  )
}

function parseOption(text) {
  const goodRx = /\*?Hệ quả tốt\*?:?|\*?HỆ QUẢ TỐT\*?:?/
  const badRx  = /\*?Hệ quả xấu\*?:?|\*?HỆ QUẢ XẤU\*?:?/
  if (goodRx.test(text) || badRx.test(text)) {
    const parts = text.split(goodRx)
    const action = parts[0].trim()
    const sub = (parts[1] || "").split(badRx)
    return { action, good: sub[0]?.trim() || "", bad: sub[1]?.trim() || "" }
  }
  return { action: text.trim(), good: "", bad: "" }
}

export default function App() {
  const [phase, setPhase]         = useState("loading")
  const [code, setCode]           = useState(urlCode)
  const [codeInput, setCodeInput] = useState("")
  const [codeError, setCodeError] = useState("")
  const [region, setRegion]       = useState("")
  const [scenarios, setScenarios] = useState([])
  const [current, setCurrent]     = useState(() => {
    if (!urlCode) return 0
    try { return parseInt(localStorage.getItem(`current_${urlCode}`)) || 0 }
    catch { return 0 }
  })
  const [answers, setAnswers]     = useState(() => {
    if (!urlCode) return {}
    try {
      const saved = localStorage.getItem(`answers_${urlCode}`)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [errorMsg, setErrorMsg]   = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const c = (params.get("code") || "").toUpperCase().replace(/-/g, "")
    if (c) { setCode(c); loadSurvey(c) }
    else setPhase("code")
  }, [])

  async function loadSurvey(c) {
    setPhase("loading")
    try {
      const ids = await fetchAssignment(c)
      if (!ids) { setCodeError("Mã không hợp lệ. Vui lòng kiểm tra lại."); setPhase("code"); return }
      const data = await fetchScenarios(ids)
      if (!data || data.length === 0) { setErrorMsg("Không tải được câu hỏi. Thử lại sau."); setPhase("error"); return }
      const shuffled = seededShuffle(data, c)
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
    const normalized = codeInput.trim().replace(/-/g, "")
    if (!normalized) { setCodeError("Vui lòng nhập mã tham gia."); return }
    setCode(normalized)
    loadSurvey(normalized)
  }

  async function handleSubmit() {
    setPhase("submitting")
    const answerList = Object.entries(answers).map(([sid, choice]) => ({
      scenario_id: parseInt(sid), choice,
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
  const total           = scenarios.length
  const progress        = total > 0
    ? ((current + (currentScenario && answers[currentScenario.id] ? 1 : 0)) / total) * 100
    : 0

  const phaseSubtitle = {
    loading:    null,
    code:       "Phần 1 / 4 · Mã tham gia",
    region:     "Phần 2 / 4 · Nhân khẩu học",
    survey:     "Phần 3 / 4 · Tình huống đạo đức",
    submitting: null,
    done:       "Phần 4 / 4 · Ghi nhận",
    error:      null,
  }[phase]

  return (
    <>
      <style>{styles}</style>
      <div className="A-root">
        <div className="A-page">

          <header className="A-masthead">
            <div className="A-masthead__top A-mono">
              <span>VOL. I · NO. 02 · 2026</span>
              <span className="A-masthead__center">ISSN 2026—AIE</span>
              <span>UIT · KHOA CNPM</span>
            </div>
            <h1 className="A-masthead__title">Ethic in Education</h1>
            <p className="A-masthead__subtitle">
              Khảo sát học thuật về đạo đức Trí tuệ Nhân tạo trong môi trường giáo dục Việt Nam
            </p>
            <div className="A-masthead__byline A-mono">
              <span>Nghiên cứu · Tạ Gia Khiêm, Hoàng Vũ Hữu Nhân</span>
              <span className="A-masthead__sep">·</span>
              <span>Giảng viên hướng dẫn · Nguyễn Tấn Hoàng Phước</span>
            </div>
            {phaseSubtitle && (
              <div className="A-masthead__phase A-mono">{phaseSubtitle}</div>
            )}
          </header>

          {phase === "loading" && (
            <section className="A-stage A-stage--center">
              <div className="A-frame">
                <p className="A-lede">Đang tải...</p>
              </div>
            </section>
          )}

          {phase === "code" && (
            <section className="A-stage A-stage--center">
              <div className="A-frame">
                <div className="A-eyebrow A-mono">§ 01 · TIẾP NHẬN</div>
                <h2 className="A-h-display">Mã tham gia khảo sát</h2>
                <p className="A-lede">
                  Mỗi người tham gia được cấp một mã định danh phục vụ việc đối chiếu dữ liệu.
                  Mã này không liên kết với danh tính cá nhân và được sử dụng nội bộ trong nghiên cứu.
                </p>
                <OrnamentRule />
                <div className="A-code-row">
                  <input
                    className="A-code-input"
                    placeholder="VN001"
                    maxLength={8}
                    autoFocus
                    value={codeInput}
                    onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeError("") }}
                    onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                  />
                  <button className="A-btn" onClick={handleCodeSubmit}>
                    Vào khảo sát <span className="A-btn__arrow">→</span>
                  </button>
                </div>
                {codeError && <p className="A-err">{codeError}</p>}
                <p className="A-footnote">
                  <sup>1</sup>&nbsp;Mã được cung cấp bởi giảng viên hoặc người tổ chức.
                </p>
              </div>
            </section>
          )}

          {phase === "region" && (
            <section className="A-stage">
              <div className="A-frame" style={{ maxWidth: "100%", textAlign: "left" }}>
                <div className="A-eyebrow A-mono">§ 02 · NHÂN KHẨU HỌC</div>
                <h2 className="A-h-display">Bạn lớn lên ở vùng nào?</h2>
                <p className="A-lede" style={{ margin: "0 0 28px" }}>
                  Thông tin vùng miền giúp phân tích sự khác biệt văn hoá trong cách nhìn nhận
                  đạo đức AI. Không thu thập tỉnh/thành cụ thể.
                </p>
                <OrnamentRule />
                <div className="A-region-grid">
                  {[
                    { key: "B", label: "Miền Bắc",  caption: "Hà Nội, đồng bằng sông Hồng, vùng núi phía Bắc" },
                    { key: "T", label: "Miền Trung", caption: "Bắc Trung Bộ, Nam Trung Bộ, Tây Nguyên" },
                    { key: "N", label: "Miền Nam",   caption: "Đông Nam Bộ, đồng bằng sông Cửu Long" },
                  ].map((r) => (
                    <button
                      key={r.key}
                      className={`A-region ${region === r.label ? "A-region--on" : ""}`}
                      onClick={() => setRegion(r.label)}
                    >
                      <span className="A-region__key A-mono">{r.key}</span>
                      <span className="A-region__label">{r.label}</span>
                      <span className="A-region__caption">{r.caption}</span>
                    </button>
                  ))}
                </div>
                <div className="A-region-cta">
                  <button className="A-btn" disabled={!region} onClick={() => setPhase("survey")}>
                    Bắt đầu trả lời <span className="A-btn__arrow">→</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {phase === "survey" && currentScenario && (
            <section className="A-stage">
              <div className="A-progress">
                <div className="A-progress__meta A-mono">
                  <span>Tình huống {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
                  <span>{totalAnswered}/{total} đã trả lời</span>
                </div>
                <div className="A-progress__bar">
                  <div className="A-progress__fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <article className="A-article">
                <div className="A-article__head">
                  <span className="A-eyebrow A-mono">
                    § {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {currentScenario.topic.toUpperCase()}
                  </span>
                  <div className="A-article__rule" />
                </div>
                <h2 className="A-article__title">{currentScenario.title}</h2>
                <p className="A-article__prompt">{currentScenario.context}</p>

                <div className="A-article__divider">
                  <span className="A-mono">PHƯƠNG ÁN HÀNH ĐỘNG</span>
                </div>

                <div className="A-options">
                  {["option_1", "option_2", "option_3"]
                    .filter((k) => currentScenario[k]?.trim())
                    .map((k, i) => {
                      const letter   = ["A", "B", "C"][i]
                      const selected = answers[currentScenario.id] === letter
                      const { action, good, bad } = parseOption(currentScenario[k])
                      return (
                        <button
                          key={letter}
                          className={`A-option ${selected ? "A-option--on" : ""}`}
                          onClick={() =>
                            setAnswers((prev) => {
                              const next = { ...prev, [currentScenario.id]: letter }
                              localStorage.setItem(`answers_${code}`, JSON.stringify(next))
                              return next
                            })
                          }
                        >
                          <div className="A-option__head">
                            <span className="A-option__letter A-mono">{letter}</span>
                            <span className="A-option__action">{action}</span>
                          </div>
                          {(good || bad) && (
                            <div className="A-option__cols">
                              <div className="A-conseq A-conseq--good">
                                <div className="A-conseq__label A-mono">
                                  <span className="A-conseq__mark">+</span> Hệ quả tích cực
                                </div>
                                <p>{good}</p>
                              </div>
                              <div className="A-conseq__sep" />
                              <div className="A-conseq A-conseq--bad">
                                <div className="A-conseq__label A-mono">
                                  <span className="A-conseq__mark">−</span> Hệ quả tiêu cực
                                </div>
                                <p>{bad}</p>
                              </div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                </div>
              </article>

              <nav className="A-nav">
                <button
                  className="A-btn A-btn--ghost"
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  style={{ visibility: current === 0 ? "hidden" : "visible" }}
                >
                  <span className="A-btn__arrow">←</span> Tình huống trước
                </button>
                {current < total - 1 ? (
                  <button
                    className="A-btn"
                    disabled={!answers[currentScenario.id]}
                    onClick={() => {
                      const next = current + 1
                      setCurrent(next)
                      localStorage.setItem(`current_${code}`, next)
                    }}
                  >
                    Tình huống tiếp theo <span className="A-btn__arrow">→</span>
                  </button>
                ) : (
                  <button
                    className="A-btn"
                    disabled={totalAnswered < total}
                    onClick={handleSubmit}
                  >
                    Hoàn tất khảo sát <span className="A-btn__arrow">→</span>
                  </button>
                )}
              </nav>

              {current === total - 1 && totalAnswered < total && (
                <p className="A-pending">
                  Còn {total - totalAnswered} tình huống chưa có câu trả lời
                </p>
              )}
            </section>
          )}

          {phase === "submitting" && (
            <section className="A-stage A-stage--center">
              <div className="A-frame">
                <p className="A-lede">Đang ghi nhận câu trả lời...</p>
              </div>
            </section>
          )}

          {phase === "done" && (
            <section className="A-stage A-stage--center">
              <div className="A-frame A-frame--done">
                <svg className="A-seal" viewBox="0 0 80 80" width="80" height="80">
                  <circle cx="40" cy="40" r="38" fill="none" stroke="var(--oxide)" strokeWidth="1" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--oxide)" strokeWidth="0.5" />
                  <text x="40" y="46" textAnchor="middle" fontFamily="Spectral" fontSize="22" fontStyle="italic" fill="var(--oxide)">✓</text>
                </svg>
                <div className="A-eyebrow A-mono">§ FIN · ĐÃ GHI NHẬN</div>
                <h2 className="A-h-display">Cảm ơn đóng góp của bạn.</h2>
                <p className="A-lede">
                  Câu trả lời đã được lưu vào tập dữ liệu nghiên cứu. Kết quả tổng hợp sẽ được
                  công bố dưới dạng báo cáo học thuật, không kèm thông tin cá nhân.
                </p>
                <OrnamentRule />
                <p className="A-footnote">
                  Nghiên cứu này tuân theo nguyên tắc đạo đức nghiên cứu của Đại học Công nghệ Thông tin.
                  Mọi câu hỏi xin gửi về giảng viên hướng dẫn: Nguyễn Tấn Hoàng Phước.
                </p>
              </div>
            </section>
          )}

          {phase === "error" && (
            <section className="A-stage A-stage--center">
              <div className="A-frame">
                <div className="A-eyebrow A-mono">Lỗi</div>
                <p className="A-lede">{errorMsg}</p>
                <button className="A-btn" style={{ marginTop: 24 }} onClick={() => window.location.reload()}>
                  Thử lại <span className="A-btn__arrow">→</span>
                </button>
              </div>
            </section>
          )}

          <footer className="A-foot">
            <span>© 2026 — Ethic in Education</span>
            <span>·</span>
            <span>Khảo sát học thuật, không thương mại</span>
            <span>·</span>
            <span>Mã: {code || "—"}</span>
          </footer>

        </div>
      </div>
    </>
  )
}
