import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  await connectDB();
  const { userId } = getAuth(req);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const tasks = await Task.find({ userId });
  return new Response(JSON.stringify(tasks), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const { userId } = getAuth(req);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { text } = await req.json();
  const newTask = await Task.create({ text, userId, completed: false });
  return new Response(JSON.stringify(newTask), { status: 201 });
}

export async function PUT(req) {
  await connectDB();
  const { userId } = getAuth(req);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = await req.json();
  const task = await Task.findOneAndUpdate(
    { _id: id, userId },
    { $set: { completed: true } },
    { new: true }
  );

  if (!task) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(task), { status: 200 });
}

export async function DELETE(req) {
  await connectDB();
  const { userId } = getAuth(req);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = await req.json();
  const task = await Task.findOneAndDelete({ _id: id, userId });

  if (!task) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
    });
  }

  return new Response(
    JSON.stringify({ message: "Task deleted successfully" }),
    { status: 200 }
  );
}
