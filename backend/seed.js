const mongoose = require("mongoose");
const dotenv = require("dotenv");
const FamilyMember = require("./models/FamilyMember");
const { familyNodes } = require("../data/familytree.js"); 
// ⚠️ adjust this path to wherever your familytree.js is

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await FamilyMember.deleteMany(); // clear existing
  console.log("Cleared existing family members");

  const members = Object.values(familyNodes).map(node => ({
    nodeId: node.id,
    name: node.name,
    imageUrl: node.imageUrl || "",
    childrenIds: node.childrenIds || [],
  }));

  await FamilyMember.insertMany(members);
  console.log(`Seeded ${members.length} family members`);

  mongoose.disconnect();
}

seed().catch(console.error);