/* -----------------------------
   Helpers
------------------------------ */
function svgEl(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function setAttrs(el, attrs) {
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* -----------------------------
   1) SVG Visualization (Bar Chart)
   - "chosen visualization": skills/tool usage
   - All elements created by JS (meets requirement strongly)
------------------------------ */
function renderBarChart() {
  const svg = document.getElementById("vizChart");
  if (!svg) return;

  // Clear previous
  svg.innerHTML = "";

  // Data (you can change to anything creative)
  const data = [
    { label: "Unity VFX", value: 90 },
    { label: "Blender", value: 75 },
    { label: "Maya", value: 65 },
    { label: "HTML/CSS", value: 70 },
    { label: "Tableau", value: 60 }
  ];

  // Dimensions based on rendered size
  const width = svg.getBoundingClientRect().width || 900;
  const height = 420;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  // Background
  const bg = setAttrs(svgEl("rect"), {
    x: 0, y: 0, width, height,
    fill: "#ffffff",
    rx: 16
  });
  svg.appendChild(bg);

  // Title (still inside SVG, not page content)
  const title = setAttrs(svgEl("text"), {
    x: margin.left,
    y: 28,
    "font-size": 18,
    "font-weight": 700,
    fill: "#222"
  });
  title.textContent = "Skill Focus (SVG Bar Chart)";
  svg.appendChild(title);

  // Axes group
  const g = svgEl("g");
  setAttrs(g, { transform: `translate(${margin.left},${margin.top})` });
  svg.appendChild(g);

  // Scales
  const maxV = 100; // using 0-100 scale
  const xStep = chartW / data.length;
  const barW = xStep * 0.65;

  function yScale(v) {
    return chartH - (v / maxV) * chartH;
  }

  // Y axis line
  g.appendChild(setAttrs(svgEl("line"), {
    x1: 0, y1: 0, x2: 0, y2: chartH,
    stroke: "#d9d9d9"
  }));

  // X axis line
  g.appendChild(setAttrs(svgEl("line"), {
    x1: 0, y1: chartH, x2: chartW, y2: chartH,
    stroke: "#d9d9d9"
  }));

  // Y ticks (0,25,50,75,100)
  const ticks = [0, 25, 50, 75, 100];
  ticks.forEach(t => {
    const y = yScale(t);

    g.appendChild(setAttrs(svgEl("line"), {
      x1: -6, y1: y, x2: 0, y2: y,
      stroke: "#cfcfcf"
    }));

    const tLabel = setAttrs(svgEl("text"), {
      x: -10, y: y + 4,
      "text-anchor": "end",
      "font-size": 12,
      fill: "#666"
    });
    tLabel.textContent = t;
    g.appendChild(tLabel);

    // Light grid line
    g.appendChild(setAttrs(svgEl("line"), {
      x1: 0, y1: y, x2: chartW, y2: y,
      stroke: "#f0f0f0"
    }));
  });

  // Tooltip group (simple)
  const tip = setAttrs(svgEl("g"), { opacity: 0 });
  const tipBg = setAttrs(svgEl("rect"), { x: 0, y: 0, width: 140, height: 40, rx: 10, fill: "#111" });
  const tipText = setAttrs(svgEl("text"), { x: 12, y: 25, fill: "#fff", "font-size": 12 });
  tip.appendChild(tipBg);
  tip.appendChild(tipText);
  svg.appendChild(tip);

  function showTip(px, py, text) {
    tipText.textContent = text;
    tip.setAttribute("opacity", "1");
    tip.setAttribute("transform", `translate(${px},${py})`);
  }
  function hideTip() {
    tip.setAttribute("opacity", "0");
  }

  // Bars
  data.forEach((d, i) => {
    const x = i * xStep + (xStep - barW) / 2;
    const y = yScale(d.value);
    const h = chartH - y;

    const bar = setAttrs(svgEl("rect"), {
      x, y,
      width: barW,
      height: h,
      rx: 10,
      fill: "#35b84b" // matches your theme
    });

    // Hover interaction
    bar.addEventListener("mouseenter", () => {
      const svgRect = svg.getBoundingClientRect();
      const tipX = margin.left + x + barW / 2 - 70;
      const tipY = margin.top + y - 50;
      showTip(tipX, Math.max(10, tipY), `${d.label}: ${d.value}/100`);
      bar.setAttribute("opacity", "0.85");
    });
    bar.addEventListener("mouseleave", () => {
      hideTip();
      bar.setAttribute("opacity", "1");
    });

    g.appendChild(bar);

    // X labels
    const lbl = setAttrs(svgEl("text"), {
      x: x + barW / 2,
      y: chartH + 28,
      "text-anchor": "middle",
      "font-size": 12,
      fill: "#555"
    });
    lbl.textContent = d.label;
    g.appendChild(lbl);
  });
}

/* -----------------------------
   2) Creative SVG Art (JS)
   Generative "ribbons" that animate
------------------------------ */
function renderGenerativeArt() {
  const svg = document.getElementById("vizArt");
  if (!svg) return;

  svg.innerHTML = "";

  const width = svg.getBoundingClientRect().width || 900;
  const height = 520;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  svg.appendChild(setAttrs(svgEl("rect"), {
    x: 0, y: 0, width, height, rx: 16,
    fill: "#ffffff"
  }));

  const title = setAttrs(svgEl("text"), {
    x: 24,
    y: 34,
    "font-size": 18,
    "font-weight": 700,
    fill: "#222"
  });
  title.textContent = "Creative SVG Art (Generated with JS)";
  svg.appendChild(title);

  const g = svgEl("g");
  svg.appendChild(g);

  const lineCount = 18;
  const pointsPerLine = 40;

  const paths = [];
  for (let i = 0; i < lineCount; i++) {
    const p = setAttrs(svgEl("path"), {
      fill: "none",
      stroke: i % 2 === 0 ? "#35b84b" : "#0a66c2",
      "stroke-width": 2,
      "stroke-linecap": "round",
      opacity: 0.20
    });
    paths.push(p);
    g.appendChild(p);
  }

  function wave(x, t, k1, k2) {
    return Math.sin(x * k1 + t) * 18 + Math.cos(x * k2 - t * 0.7) * 10;
  }

  let t = 0;

  function draw() {
    t += 0.02;

    const topPad = 70;
    const usableH = height - topPad - 20;

    paths.forEach((path, idx) => {
      const baseY = topPad + (usableH * (idx / (lineCount - 1)));
      const amp = 14 + idx * 0.6;

      let d = "";
      for (let j = 0; j < pointsPerLine; j++) {
        const x = (width * j) / (pointsPerLine - 1);
        const y = baseY + wave(j * 0.35, t + idx * 0.15, 1.2, 0.7) * (amp / 18);

        if (j === 0) d += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
        else d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      path.setAttribute("d", d);
    });

    requestAnimationFrame(draw);
  }

  // Mouse interaction: brighter when mouse moves to the right
  svg.addEventListener("mousemove", (e) => {
    const r = svg.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const strength = mx / r.width;

    paths.forEach((p, i) => {
      const base = 0.12 + (i / lineCount) * 0.18;
      p.setAttribute("opacity", (base + strength * 0.18).toFixed(3));
    });
  });

  svg.addEventListener("mouseleave", () => {
    paths.forEach((p, i) => {
      const base = 0.12 + (i / lineCount) * 0.18;
      p.setAttribute("opacity", base.toFixed(3));
    });
  });

  draw();
}

/* -----------------------------
   Init + responsive re-render
------------------------------ */
function initVis() {
  renderBarChart();
  renderGenerativeArt();
}

window.addEventListener("load", initVis);
window.addEventListener("resize", () => {
  renderBarChart();
  renderGenerativeArt();
});

