import { useEffect, useState } from 'react'

// Motion purpose: teach the actual body movement, rather than just move an object.
// SVG characters remain clear when reduced motion is preferred.
const SHIRTS = ['#29a8dc','#f77882','#c6a0ef','#7bc98e','#f3ae4d']
const SKIN = ['#f2c49c','#c88965','#e6ad7f','#b97d58','#edbd91']

function Person({ x, y, index = 0, pose = 'stand', leader = false }) {
  const shirt = SHIRTS[index % SHIRTS.length]
  const skin = SKIN[index % SKIN.length]
  const armUp = pose === 'over' || pose === 'hoop'
  const legsWide = pose === 'under' || pose === 'hoop'
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="13" rx="29" ry="8" fill="#071d19" opacity=".28"/>
    <g stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none">
      <path d={legsWide ? 'M-9 -24 L-24 2 L-32 10' : 'M-9 -24 L-14 10'} />
      <path d={legsWide ? 'M9 -24 L24 2 L32 10' : 'M9 -24 L14 10'} />
    </g>
    <path d="M-19 -84 Q0 -93 19 -84 L17 -28 Q0 -21 -17 -28Z" fill={shirt} stroke="#12352e" strokeWidth="2"/>
    <g stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none">
      <path d={armUp ? 'M-17 -77 L-27 -102 L-22 -132' : 'M-17 -77 L-34 -56 L-43 -66'} />
      <path d={armUp ? 'M17 -77 L27 -102 L22 -132' : 'M17 -77 L34 -56 L43 -66'} />
    </g>
    <rect x="-7" y="-98" width="14" height="16" rx="5" fill={skin}/>
    <circle cy="-119" r="24" fill={skin} stroke="#12352e" strokeWidth="2"/>
    <path d="M-23 -124 Q-22 -151 0 -145 Q22 -151 23 -124 L14 -137 L0 -132 L-14 -137Z" fill={index % 2 ? '#3a2522' : '#60432b'}/>
    <circle cx="-8" cy="-119" r="2.5" fill="#24342d"/><circle cx="8" cy="-119" r="2.5" fill="#24342d"/>
    <path d="M-7 -108 Q0 -102 7 -108" stroke="#8e463c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {leader && <text x="0" y="-160" textAnchor="middle" fill="#ffdf56" fontSize="16" fontWeight="bold">המוביל</text>}
  </g>
}

function MovingBall({ d, duration = '5s', radius = 16 }) {
  return <g><circle r={radius} fill="#ffe5a4" stroke="#e98519" strokeWidth="4"/><path d="M-6 -5 L6 5 M-6 5 L6 -5" stroke="#e98519" strokeWidth="2"/>
    <animateMotion path={d} dur={duration} repeatCount="indefinite"/>
  </g>
}
function Caption({ children }) {return <text x="300" y="332" textAnchor="middle" fontSize="22" fontWeight="700" fill="white">{children}</text>}

export default function AnimatedClassKids({ id }) {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const update = () => setReduce(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  const positions = [105, 235, 365, 495]
  return <svg viewBox="0 0 600 355" className="w-full" role="img" aria-label="ילדים מצוירים מדגימים את תנועת המשחק">
    <rect x="4" y="4" width="592" height="347" rx="20" fill="#153d31" stroke="#37745b" strokeWidth="3"/>
    <path d="M30 292 L570 292" stroke="#6e987c" strokeWidth="4" />
    {(id === 'hoop') && <>
      <path d="M105 208 L235 208 L365 208 L495 208" stroke="#f2c49c" strokeWidth="6" strokeDasharray="10 7"/>
      {positions.map((x,i)=><Person key={x} x={x} y={278} index={i} pose="hoop"/>)}
      {reduce ? <ellipse cx="105" cy="213" rx="37" ry="70" fill="none" stroke="#ffda50" strokeWidth="11"/> :
        <g>
          <ellipse cx="0" cy="0" rx="37" ry="68" fill="none" stroke="#ffda50" strokeWidth="10"/>
          <animateTransform attributeName="transform" type="translate" dur="9s" repeatCount="indefinite"
            values="105 218;105 177;105 150;105 218;235 218;235 177;235 150;235 218;365 218;365 177;365 150;365 218;495 218"
            keyTimes="0;.08;.16;.24;.32;.4;.48;.56;.64;.72;.8;.88;1"/>
        </g>}
      <Caption>החישוק עובר מעל הגוף בלי לשחרר ידיים</Caption>
    </>}
    {(id === 'over' || id === 'under') && <>
      {positions.map((x,i)=><Person key={x} x={x} y={260} index={i} pose={id}/>)}
      {reduce ? <circle cx="105" cy={id==='over'?100:277} r="16" fill="#ffe5a4"/> :
        <MovingBall d={id==='over'?'M105 96 Q170 45 235 96 Q300 45 365 96 Q430 45 495 96':'M105 275 L235 275 L365 275 L495 275'} duration="6s" />}
      <Caption>{id === 'over' ? 'מוסרים מעל הראש מיד ליד' : 'מגלגלים בעדינות מתחת לרגליים'}</Caption>
    </>}
    {(id === 'mirror') && <>
      <Person x={180} y={270} index={0} leader/><Person x={420} y={270} index={1}/>
      <g stroke="#f2c49c" strokeWidth="10" strokeLinecap="round">
        <path d="M160 190 L125 142" />
        <path d="M440 190 L475 142" />
        {!reduce && <><animateTransform attributeName="transform" type="translate" values="0 0;0 30;0 0" dur="3s" repeatCount="indefinite"/></>}
      </g>
      <path d="M300 96 L300 280" stroke="#f4d67c" strokeWidth="3" strokeDasharray="7 8" opacity=".7"/>
      <Caption>הילד השני מחקה את אותה תנועה</Caption>
    </>}
    {(id === 'circleball') && <>
      {[[300,120],[455,202],[300,285],[145,202]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y+50}) scale(.65)`}><Person x={0} y={0} index={i}/></g>)}
      {reduce ? <circle cx="300" cy="160" r="16" fill="#ffe5a4"/> : <MovingBall d="M300 152 L455 234 L300 316 L145 234 Z" duration="7s"/>}
      <Caption>מוסרים לחבר שלידנו עד שהכדור חוזר</Caption>
    </>}
  </svg>
}
