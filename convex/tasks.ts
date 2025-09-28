import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("mockdata").collect();
  },
});

export const send = mutation({
  args: { sender: v.string(), receiver: v.string(), message: v.string() },
  // args: {},
  handler: async (ctx, { sender, receiver, message }) => {
    await ctx.db.insert("mockdata", {
      sender,
      receiver,
      message,
    });
  },
});
