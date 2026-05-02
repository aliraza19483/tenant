import DashboardConfig from "../db/models/DashboardConfig";
import Conversation from "../db/models/Conversation";
import User from "../db/models/User";
import connectToDatabase from "../db/connect";
import mongoose from "mongoose";

export async function getDashboardConfig(projectId: string) {
  await connectToDatabase();
  return DashboardConfig.findOne({ projectId: new mongoose.Types.ObjectId(projectId) });
}

export async function updateDashboardConfig(projectId: string, updateData: any) {
  await connectToDatabase();
  return DashboardConfig.findOneAndUpdate(
    { projectId: new mongoose.Types.ObjectId(projectId) },
    { $set: updateData },
    { new: true }
  );
}

export async function getDashboardData(projectId: string) {
  await connectToDatabase();
  
  const pId = new mongoose.Types.ObjectId(projectId);
  
  const totalConversations = await Conversation.countDocuments({ projectId: pId });
  const activeUsers = await User.countDocuments({ projectId: pId });
  
  const recentConversations = await Conversation.find({ projectId: pId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title createdAt")
    .lean();
    
  const recentActivity = recentConversations.map((c: any) => ({
    id: c._id.toString(),
    title: c.title,
    time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recently",
  }));

  // Dummy chart data for demonstration
  const chartData = [
    { name: "Mon", count: Math.max(2, totalConversations / 5) },
    { name: "Tue", count: Math.max(5, totalConversations / 4) },
    { name: "Wed", count: Math.max(3, totalConversations / 3) },
    { name: "Thu", count: Math.max(8, totalConversations / 2) },
    { name: "Fri", count: totalConversations || 10 }
  ];

  return {
    totalConversations,
    activeUsers,
    recentActivity,
    chartData
  };
}
