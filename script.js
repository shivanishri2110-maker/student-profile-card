const defaults = {
  name: "Aarav Mehta",
  department: "Computer Science",
  year: "2",
  skills: ["Python", "UI design", "Problem solving", "Teamwork"],
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&h=320&q=85",
};

const storageKey = "student-profile-card-v1";
let profile;
try {
  profile = { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
} catch {
  profile = { ...defaults };
}

const byId = (id) => document.getElementById(id);
const dialog = byId("edit-dialog");

function renderProfile() {
  byId("student-name").textContent = profile.name;
  byId("student-department").textContent = profile.department;
  byId("student-year").textContent = `YEAR ${profile.year}`;
  byId("profile-photo").src = profile.photo;
  byId("profile-photo").alt = `${profile.name}'s profile photo`;

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const skillsList = byId("skills-list");
  skillsList.replaceChildren();
  (skills.length ? skills : ["Add your skills"]).forEach((skill) => {
    const chip = document.createElement("span");
    chip.className = "skill-chip";
    chip.textContent = skill;
    skillsList.append(chip);
  });

  const socialLinks = byId("social-links");
  socialLinks.replaceChildren();
  [["in", profile.linkedin, "LinkedIn"], ["GH", profile.github, "GitHub"]].forEach(([label, url, title]) => {
    if (!url) return;
    const link = document.createElement("a");
    link.className = "social-link";
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.title = title;
    link.setAttribute("aria-label", title);
    link.textContent = label;
    socialLinks.append(link);
  });
}

function openEditor() {
  byId("input-name").value = profile.name;
  byId("input-department").value = profile.department;
  byId("input-year").value = profile.year;
  byId("input-skills").value = (profile.skills || []).join(", ");
  byId("input-linkedin").value = profile.linkedin || "";
  byId("input-github").value = profile.github || "";
  dialog.showModal();
}

byId("edit-button").addEventListener("click", openEditor);
byId("close-dialog").addEventListener("click", () => dialog.close());
byId("cancel-button").addEventListener("click", () => dialog.close());

byId("profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  profile = {
    ...profile,
    name: byId("input-name").value.trim(),
    department: byId("input-department").value.trim(),
    year: byId("input-year").value,
    skills: byId("input-skills").value.split(",").map((skill) => skill.trim()).filter(Boolean),
    linkedin: byId("input-linkedin").value.trim(),
    github: byId("input-github").value.trim(),
  };
  localStorage.setItem(storageKey, JSON.stringify(profile));
  renderProfile();
  dialog.close();
});

byId("photo-input").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    event.target.value = "";
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    alert("Please choose an image smaller than 2 MB.");
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    profile.photo = reader.result;
    localStorage.setItem(storageKey, JSON.stringify(profile));
    renderProfile();
  });
  reader.readAsDataURL(file);
});

renderProfile();
