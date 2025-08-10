export interface OSINTResult {
  queryName?: string;
  predictedGender?: string;
  confidence?: number; // 0..1
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
  publicPhotos: Array<{ url: string; source: string; title?: string }>;
  summary: string;
  sources: Array<{ name: string; url: string }>;
}

// Mocked reverse image + social discovery
export async function searchOpenWeb(imageDataUrl: string, nameHint?: string): Promise<OSINTResult> {
  // Simulate network/processing delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  const names = [
    "Adebayo Johnson",
    "Fatima Abdullahi",
    "Chinedu Okafor",
    "Ngozi Eze",
    "Ibrahim Musa",
  ];

  const selectedName = nameHint || names[Math.floor(Math.random() * names.length)];
  const gender = /fatima|ngozi|eze/i.test(selectedName) ? "Female" : "Male";
  const confidence = Math.random() * 0.25 + 0.6; // 0.6 - 0.85

  // Use the captured image as the first photo (preview)
  const photos = [
    { url: imageDataUrl, source: "Captured Image", title: "Capture Preview" },
    { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400", source: "Unsplash", title: `${selectedName} – event` },
    { url: "https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?q=80&w=400", source: "Unsplash", title: `${selectedName} – profile` },
  ];

  const socials = {
    facebook: `https://facebook.com/${selectedName.toLowerCase().replace(/\s+/g, ".")}`,
    twitter: `https://twitter.com/${selectedName.split(" ")[0].toLowerCase()}_${selectedName.split(" ")[1]?.toLowerCase() || "user"}`,
    instagram: `https://instagram.com/${selectedName.toLowerCase().replace(/\s+/g, "_")}`,
    linkedin: `https://linkedin.com/in/${selectedName.toLowerCase().replace(/\s+/g, "-")}`,
  };

  const sources = [
    { name: "Google Images", url: "https://images.google.com/" },
    { name: "Facebook", url: socials.facebook! },
    { name: "LinkedIn", url: socials.linkedin! },
  ];

  const summary = `Preliminary open‑web scan found public profiles possibly related to ${selectedName}. Results are illustrative only (mocked) and should be verified.`;

  return {
    queryName: selectedName,
    predictedGender: gender,
    confidence,
    socialLinks: socials,
    publicPhotos: photos,
    summary,
    sources,
  };
}
