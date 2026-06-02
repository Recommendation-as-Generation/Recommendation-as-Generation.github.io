const palette = [
  { row: "#eff5f1", rail: "#c7d8cf", accent: "#4e7c66" },
  { row: "#f4f0e8", rail: "#ded3bf", accent: "#8a6f45" },
  { row: "#edf2f7", rail: "#cad7e3", accent: "#4f6f8d" },
  { row: "#f5eeee", rail: "#decaca", accent: "#8b5f5f" },
  { row: "#eef3f2", rail: "#c7d7d5", accent: "#587a78" },
  { row: "#f2f1f6", rail: "#d2cedf", accent: "#6d638e" }
];

const root = document.getElementById("timelineRoot");
const emptyState = document.getElementById("emptyState");
const userCount = document.getElementById("userCount");
const itemCount = document.getElementById("itemCount");
const frameworkBoard = document.getElementById("frameworkBoard");
const frameworkDetail = document.getElementById("frameworkDetail");

const frameworkModules = [
  {
    id: "dsve",
    title: "Disentangled Semantic Video Encoders",
    description: "Disentangled Semantic Video Encoders map each input video into disentangled Semantic IDs(D-SIDs) by separating semantic content from creative attributes. They combine multimodal representation learning with residual-quantization tokenization, producing content and creative SID sequences that form the shared discrete latent space for recommendation and generation.",
    box: { left: 1.7, top: 2.6, width: 39.04, height: 36.0 }
  },
  {
    id: "grm",
    title: "Generative Recommendation Model",
    description: "The Generative Recommendation Model autoregressively predicts future-interest D-SIDs from user context, including static profile features and behavior histories. In RaG, these predicted D-SIDs are treated as generative interest representations that can be decoded into new personalized videos beyond a fixed content corpus.",
    box: { left: 1.7, top: 38, width: 19.4, height: 32.0 }
  },
  {
    id: "im",
    title: "Instruction Model",
    description: "The Instruction Model translates D-SIDs into shot-level video production instructions. Conditioned on reconstructed SID embeddings and metadata such as topic tags or product information, it generates instructions that specify scene composition, camera motion, temporal pacing, and cinematic style.",
    box: { left: 21.7, top: 38, width: 18.3, height: 32.0 }
  },
  {
    id: "avgs",
    title: "Video Generation Agents",
    description: "Video Generation Agents formulate personalized video generation as a structured multi-agent decision process over a shared generation state. Instead of one-shot generation, VGAs coordinate visual, audio, and effect actions conditioned on instructions, tool descriptions, and intermediate outputs.",
    box: { left: 41.2, top: 2.6, width: 56.5, height: 70 }
  },
  {
    id: "vpa",
    title: "Visual Planning Agent (VPA)",
    description: "The Visual Planning Agent acts as the global controller for video generation. It structures the overall flow and clip-level storyboard by producing scene segments, layout configurations, and temporal boundaries while considering reusable visual assets and registered visual-generation tools.",
    box: { left: 40.8, top: 44.0, width: 18.0, height: 25.6 }
  },
  {
    id: "aaa",
    title: "Audio Alignment Agent (AAA)",
    description: "The Audio Alignment Agent is conditioned on the generated instruction and the visual plan. It produces temporally aligned audio signals, including speech and background music, synchronized with scene transitions and the evolving visual sequence.",
    box: { left: 59.7, top: 44.0, width: 18.1, height: 25.6 }
  },
  {
    id: "aeea",
    title: "Artistic Effect Enhancement Agent (AEEA)",
    description: "The Artistic Effect Enhancement Agent performs post-production refinement conditioned on upstream visual and audio outputs. It adds subtitles, visual effects, transitions, highlights, and call-to-action elements so the generated video is presentation-ready for advertising recommendation.",
    box: { left: 77.0, top: 44.0, width: 18.4, height: 25.6 }
  },
  {
    id: "reward",
    title: "Synergistic Cross-Domain Reward Learning",
    description: "SCRL jointly optimizes recommendation and video generation with three reward families: video quality, interest alignment, and user feedback. It treats user feedback as the primary objective while using interest alignment and video quality as constraints, stabilizing multi-reward optimization with GDPO and a PID-controlled Lagrangian scheme.",
    box: { left: 0.8, top: 72.0, width: 98.0, height: 27.6 }
  }
];

function titleCase(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCount(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function boxValue(value) {
  return `${value}%`;
}

function versionAssetPath(path, version) {
  if (!path || !version) {
    return path;
  }

  return `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(version)}`;
}

function setupTimelineAutoScroll(scroller) {
  let direction = 1;
  let isPaused = false;
  let resumeTimer = 0;
  let intervalId = 0;

  function pauseBriefly() {
    isPaused = true;
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      isPaused = false;
    }, 1000);
  }

  function tick() {
    if (!document.body.contains(scroller)) {
      window.clearInterval(intervalId);
      return;
    }

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;

    if (!isPaused && maxScroll > 1) {
      const previousScroll = scroller.scrollLeft;
      scroller.scrollBy({ left: direction, behavior: "auto" });

      if (direction === 1 && scroller.scrollLeft >= maxScroll - 1) {
        scroller.scrollLeft = maxScroll;
        direction = -1;
      } else if (direction === -1 && scroller.scrollLeft <= 1) {
        scroller.scrollLeft = 0;
        direction = 1;
      } else if (scroller.scrollLeft === previousScroll) {
        direction *= -1;
      }
    }
  }

  scroller.addEventListener("pointerdown", pauseBriefly);
  scroller.addEventListener("wheel", pauseBriefly, { passive: true });
  scroller.addEventListener("touchstart", pauseBriefly, { passive: true });
  intervalId = window.setInterval(tick, 28);
  [0, 250, 750, 1500, 2500].forEach((delay) => {
    window.setTimeout(tick, delay);
  });
}

function initFrameworkInteraction() {
  if (!frameworkBoard || !frameworkDetail) {
    return;
  }

  const kicker = frameworkDetail.querySelector(".framework-detail-kicker");
  const title = frameworkDetail.querySelector("h4");
  const description = frameworkDetail.querySelector("p:last-child");

  function setActiveModule(module) {
    frameworkBoard.querySelectorAll(".framework-hotspot").forEach((hotspot) => {
      hotspot.classList.toggle("is-active", hotspot.dataset.moduleId === module.id);
    });

    if (kicker) {
      kicker.textContent = "Framework module";
    }

    if (title) {
      title.textContent = module.title;
    }

    if (description) {
      description.textContent = module.description;
    }
  }

  frameworkModules.forEach((module) => {
    const hotspot = document.createElement("button");
    hotspot.type = "button";
    hotspot.className = "framework-hotspot";
    hotspot.dataset.moduleId = module.id;
    hotspot.setAttribute("aria-label", module.title);
    hotspot.style.left = boxValue(module.box.left);
    hotspot.style.top = boxValue(module.box.top);
    hotspot.style.width = boxValue(module.box.width);
    hotspot.style.height = boxValue(module.box.height);

    hotspot.addEventListener("pointerenter", () => setActiveModule(module));
    hotspot.addEventListener("focus", () => setActiveModule(module));
    hotspot.addEventListener("click", () => setActiveModule(module));

    frameworkBoard.append(hotspot);
  });
}

function parseProfile(description) {
  if (!description) {
    return [];
  }

  return description
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((items, part) => {
      const separator = part.indexOf(":");

      if (separator === -1) {
        const lastItem = items[items.length - 1];

        if (lastItem) {
          lastItem.value = `${lastItem.value}, ${part}`;
        } else {
          items.push({ label: "Profile", value: part });
        }

        return items;
      }

      items.push({
        label: titleCase(part.slice(0, separator)),
        value: part.slice(separator + 1).trim()
      });

      return items;
    }, []);
}

function getPrimaryInterest(user) {
  const interests = parseProfile(user.description).find((item) => item.label.toLowerCase() === "interests");
  const firstInterest = interests?.value.split(",")[0]?.trim();
  return firstInterest ? titleCase(firstInterest) : "Personalized Interest";
}

function getGeneratedVideoSummary(user) {
  const profileText = parseProfile(user.description)
    .map((item) => item.value)
    .join(" ")
    .toLowerCase();

  if (profileText.includes("mother") || profileText.includes("baby")) {
    return "Young Mother Lifestyle Videos";
  }

  if (profileText.includes("beauty") || profileText.includes("skincare") || profileText.includes("makeup")) {
    return "Beauty Routine Deal Videos";
  }

  if (profileText.includes("rural") || profileText.includes("country") || profileText.includes("farm")) {
    return "Rural Life Story Videos";
  }

  if (profileText.includes("snack") || profileText.includes("drink") || profileText.includes("convenience")) {
    return "Snack Deal Discovery Videos";
  }

  if (profileText.includes("social") || profileText.includes("chat") || profileText.includes("drama")) {
    return "Social Entertainment Chat Videos";
  }

  const words = getPrimaryInterest(user).split(/\s+/).slice(0, 3);
  return `${words.join(" ")} Videos`;
}

function createMedia(item) {
  if (item.type === "video") {
    const video = document.createElement("video");
    video.src = item.file;
    video.controls = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    return video;
  }

  const image = document.createElement("img");
  image.src = item.file;
  image.alt = item.name || "Browsing interest";
  image.loading = "lazy";
  return image;
}

function createTimelineItem(item, index, options = {}) {
  const card = document.createElement("article");
  card.className = `timeline-card ${item.type}`;

  if (options.cardClassName) {
    card.classList.add(options.cardClassName);
  }

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "media-wrap";
  mediaWrap.append(createMedia(item));

  if (item.type === "image" && item.caption) {
    const caption = document.createElement("p");
    caption.className = "interest-caption";
    caption.textContent = item.caption;
    mediaWrap.append(caption);
  }

  const badge = document.createElement("span");
  badge.className = "type-badge";
  badge.textContent = options.badgeText || (item.type === "video" ? "Generated recommendation" : "Browsing interest");

  const step = document.createElement("span");
  step.className = "step";
  step.textContent = String(index + 1).padStart(2, "0");

  const label = document.createElement("p");
  label.className = "asset-name";
  label.textContent = options.labelText || (item.type === "video" ? "Personalized video endpoint" : item.name || `Asset ${index + 1}`);

  if (!options.hideStep) {
    card.append(step);
  }

  if (options.badgeBeforeMedia) {
    card.append(badge, mediaWrap, label);
  } else {
    card.append(mediaWrap, badge, label);
  }

  return card;
}

function createStackItem(items, startIndex, className) {
  const stack = document.createElement("article");
  stack.className = `timeline-card image-stack ${className}`;

  const start = startIndex + 1;
  const end = startIndex + items.length;

  const step = document.createElement("span");
  step.className = "step";
  step.textContent = `${start}-${end}`;

  const preview = document.createElement("div");
  preview.className = "stack-preview";

  items.slice(0, 5).forEach((item, index) => {
    const layer = document.createElement("div");
    layer.className = "stack-layer";
    layer.style.setProperty("--stack-index", index);
    layer.append(createMedia(item));
    preview.append(layer);
  });

  const badge = document.createElement("span");
  badge.className = "type-badge";
  badge.textContent = `${items.length} history pics`;

  const label = document.createElement("p");
  label.className = "asset-name";
  label.textContent = className === "pre-video-stack" ? "Historical interests" : "Later history";

  stack.append(step, preview, badge, label);
  return stack;
}

function createStageLegend(timelineContent, renderFullMode) {
  const legend = document.createElement("div");
  legend.className = "stage-legend";
  let activeMode = "timeline";

  [
    ["timeline", "Timeline", "Show the full browsing-to-generation sequence"],
    ["signal", "Interest Signal", "Show inferred interest captions over each history image"]
  ].forEach(([mode, label, detail]) => {
    const item = document.createElement("button");
    item.className = `stage-pill ${mode}`;
    item.dataset.mode = mode;
    item.type = "button";
    item.textContent = label;
    item.setAttribute("aria-label", detail);
    item.setAttribute("aria-pressed", String(mode === activeMode));
    item.classList.toggle("is-active", mode === activeMode);

    item.addEventListener("click", () => {
      const nextMode = mode;
      activeMode = nextMode;

      timelineContent.classList.remove("mode-signal");
      legend.querySelectorAll(".stage-pill").forEach((button) => {
        const isActive = button.dataset.mode === nextMode;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      renderFullMode();

      if (nextMode === "signal") {
        timelineContent.classList.add("mode-signal");
      }
    });

    legend.append(item);
  });

  return legend;
}

function createTimelineRow(user, index) {
  const colors = palette[index % palette.length];
  const row = document.createElement("section");
  row.className = "timeline-row";
  row.style.setProperty("--row-bg", colors.row);
  row.style.setProperty("--rail", colors.rail);
  row.style.setProperty("--accent", colors.accent);

  const header = document.createElement("div");
  header.className = "user-header";

  const label = document.createElement("h2");
  label.textContent = user.label || `User${index + 1}`;

  const profileLabel = document.createElement("p");
  profileLabel.className = "profile-label";
  profileLabel.textContent = "Input Profile";

  header.append(label);
  header.append(profileLabel);

  const profileItems = parseProfile(user.description);

  if (profileItems.length > 0) {
    const profile = document.createElement("dl");
    profile.className = "profile-chips";

    profileItems.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "profile-chip";

      const term = document.createElement("dt");
      term.textContent = item.label;

      const value = document.createElement("dd");
      value.textContent = item.value;

      wrapper.append(term, value);
      profile.append(wrapper);
    });

    header.append(profile);
  }

  const timelineContent = document.createElement("div");
  timelineContent.className = "timeline-content";

  const scroller = document.createElement("div");
  scroller.className = "timeline-scroller";
  scroller.setAttribute("tabindex", "0");
  scroller.setAttribute("aria-label", `${label.textContent} recommendation timeline`);

  const rail = document.createElement("div");
  rail.className = "timeline-rail";

  const historyItems = user.items.filter((item) => item.type === "image");
  const generatedVideo = user.items.find((item) => item.type === "video");

  function renderFullMode() {
    rail.className = "timeline-rail";
    rail.replaceChildren();

    historyItems.forEach((item, itemIndex) => {
      rail.append(createTimelineItem(item, itemIndex));
    });
  }

  timelineContent.append(createStageLegend(timelineContent, renderFullMode));
  renderFullMode();

  scroller.append(rail);
  setupTimelineAutoScroll(scroller);
  timelineContent.append(scroller);

  row.append(header, timelineContent);

  if (generatedVideo) {
    const pinnedVideo = document.createElement("aside");
    pinnedVideo.className = "pinned-video";
    pinnedVideo.setAttribute("aria-label", `${label.textContent} generated recommendation`);
    pinnedVideo.append(createTimelineItem(generatedVideo, historyItems.length, {
      badgeBeforeMedia: true,
      badgeText: "AI Generated Recommendation",
      cardClassName: "pinned-generated-card",
      hideStep: true,
      labelText: getGeneratedVideoSummary(user)
    }));
    row.append(pinnedVideo);
  }

  return row;
}

function createUserCaseStudy(users) {
  let activeIndex = 0;
  const section = document.createElement("section");
  section.className = "case-study";

  const title = document.createElement("h2");
  title.className = "case-study-title";
  title.textContent = "User case study";

  const intro = document.createElement("p");
  intro.className = "case-study-intro";
  intro.textContent = "The case study below walks through the closed loop from user profile and historical interests to a generated personalized recommendation. Each active user view highlights the observed interest trajectory and the generated video endpoint produced by the system.";

  const tabs = document.createElement("div");
  tabs.className = "user-tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "User case study selector");

  const panel = document.createElement("div");
  panel.className = "case-study-panel";

  const headline = document.createElement("h3");
  headline.className = "case-headline";

  const buttons = users.map((user, index) => {
    const colors = palette[index % palette.length];
    const button = document.createElement("button");
    button.className = "user-tab";
    button.type = "button";
    button.textContent = user.label || `User${index + 1}`;
    button.setAttribute("role", "tab");
    button.style.setProperty("--tab-bg", colors.row);
    button.style.setProperty("--tab-accent", colors.accent);

    button.addEventListener("click", () => {
      activeIndex = index;
      renderActiveUser();
    });

    tabs.append(button);
    return button;
  });

  function renderActiveUser() {
    buttons.forEach((button, index) => {
      button.setAttribute("aria-selected", String(index === activeIndex));
    });

    const activeUser = users[activeIndex];
    headline.textContent = `${activeUser.label || `User${activeIndex + 1}`}: ${getPrimaryInterest(activeUser)} Interest Trajectory`;
    panel.replaceChildren(headline, createTimelineRow(activeUser, activeIndex));
  }

  renderActiveUser();
  section.append(title, intro, tabs, panel);
  return section;
}

function renderManifest(manifest) {
  const assetVersion = manifest.generatedAt || "";
  const users = Array.isArray(manifest.users)
    ? manifest.users.map((user) => ({
      ...user,
      items: Array.isArray(user.items)
        ? user.items.map((item) => ({
          ...item,
          file: versionAssetPath(item.file, assetVersion)
        }))
        : []
    }))
    : [];
  const totalItems = users.reduce((sum, user) => sum + user.items.length, 0);

  if (userCount) {
    userCount.textContent = formatCount(users.length, "user", "users");
  }

  if (itemCount) {
    itemCount.textContent = formatCount(totalItems, "asset", "assets");
  }

  root.replaceChildren();
  emptyState.hidden = users.length > 0;

  if (users.length > 0) {
    root.append(createUserCaseStudy(users));
  }
}

async function init() {
  try {
    const response = await fetch("manifest.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Manifest request failed: ${response.status}`);
    }

    const manifest = await response.json();
    renderManifest(manifest);
  } catch (error) {
    console.error(error);
    renderManifest({ users: [] });
  }
}

initFrameworkInteraction();
init();
