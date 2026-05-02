import Project from "../db/models/Project";
import connectToDatabase from "../db/connect";

export async function getProjectBySlug(slug: string) {
  await connectToDatabase();
  return Project.findOne({ slug });
}

export async function getProjectById(id: string) {
  await connectToDatabase();
  return Project.findById(id);
}
