import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  "src/features/auth/pages/RegisterClient.tsx",
  "src/features/auth/pages/RegisterFreelancer.tsx",
  "src/features/client/api/conversation.ts",
  "src/features/client/pages/ChatRoom.tsx",
  "src/features/client/pages/Home.tsx",
  "src/features/client/pages/Messages.tsx",
  "src/features/client/pages/Projects.tsx",
  "src/features/freelancer/components/ProjectInfoModal.tsx",
  "src/features/freelancer/components/SwipeCardDeck.tsx",
  "src/features/freelancer/pages/Messages.tsx",
  "src/features/freelancer/pages/ProjectDetail.tsx",
  "src/features/freelancer/pages/Projects.tsx",
];

filesToFix.forEach(relPath => {
  const p = path.join(__dirname, "../", relPath);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, "utf-8");
  
  // Replacements
  content = content.replace(/fullName/g, "name");
  content = content.replace(/profilePhotoUrl/g, "avatarUrl");
  content = content.replace(/\(n\)/g, "(n: any)");
  
  fs.writeFileSync(p, content, "utf-8");
  console.log("Fixed", relPath);
});
