let selectedPlatform = "All";

const platformColors = {
  ChatGPT: "#4C78A8",
  Claude: "#F58518",
  Gemini: "#E45756"
};

function renderGrowthChart(platform) {
  const growthChart = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 700,
    height: 400,
    data: {
      url: "data/time_series.csv"
    },
    transform: [
      {
        fold: ["ChatGPT", "Gemini", "Claude"],
        as: ["Platform", "Interest"]
      },
      ...(platform !== "All"
        ? [{ filter: `datum.Platform === '${platform}'` }]
        : [])
    ],
    mark: {
      type: "line",
      point: true
    },
    encoding: {
      x: {
        field: "Time",
        type: "temporal",
        title: "Year",
        axis: {
          format: "%Y",
          values: [
            "2021-01-01",
            "2022-01-01",
            "2023-01-01",
            "2024-01-01",
            "2025-01-01",
            "2026-01-01"
          ]
        }
      },
      y: {
        field: "Interest",
        type: "quantitative",
        title: "Search Interest"
      },
      color: {
        field: "Platform",
        type: "nominal",
        title: "Platform",
        scale: {
          domain: ["ChatGPT", "Claude", "Gemini"],
          range: ["#4C78A8", "#F58518", "#E45756"]
        }
      },
      tooltip: [
        { field: "Time", type: "temporal", title: "Date" },
        { field: "Platform", type: "nominal", title: "Platform" },
        { field: "Interest", type: "quantitative", title: "Interest" }
      ]
    }
  };

  vegaEmbed("#vis1", growthChart, { actions: false }).catch(console.error);
}

const regionalChart = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 700,
  height: 400,
  data: {
    url: "data/regional_comparison.csv"
  },
  transform: [
    {
      fold: ["ChatGPT", "Gemini", "Claude"],
      as: ["Platform", "Interest"]
    }
  ],
  mark: "bar",
  encoding: {
    x: {
      field: "Country",
      type: "nominal",
      title: "Country",
      axis: {
        labelAngle: 0
      }
    },
    xOffset: {
      field: "Platform"
    },
    y: {
      field: "Interest",
      type: "quantitative",
      title: "Search Interest"
    },
    color: {
      field: "Platform",
      type: "nominal",
      title: "Platform",
      scale: {
        domain: ["ChatGPT", "Claude", "Gemini"],
        range: ["#4C78A8", "#F58518", "#E45756"]
      }
    },
    tooltip: [
      { field: "Country", type: "nominal", title: "Country" },
      { field: "Platform", type: "nominal", title: "Platform" },
      { field: "Interest", type: "quantitative", title: "Interest" }
    ]
  }
};

vegaEmbed("#vis2", regionalChart, { actions: false }).catch(console.error);

renderGrowthChart(selectedPlatform);

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    selectedPlatform = button.dataset.platform;
    renderGrowthChart(selectedPlatform);
  });
});
