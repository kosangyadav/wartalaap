import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getUser = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();
  },
});

export const checkUser = action({
  args: {
    username: v.string(),
    action: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { username, password, action },
  ): Promise<{
    success: boolean;
    message: string;
    userId?: string;
    email?: string;
  }> => {
    // console.log(username);
    const user = await ctx.runQuery(internal.auth.getUser, { username });
    // console.log(user);
    if (action === "signup") {
      return {
        success: user === null,
        message: user ? "Username already taken" : "Username available",
      };
    } else if (user === null) {
      return { success: false, message: "User not found" };
    } else if (user.password !== password) {
      return { success: false, message: "Incorrect password" };
    } else {
      return {
        success: true,
        message: "Validation successful",
        userId: user._id,
        email: user.email,
      };
      // return user !== null && user.password === password;
    }
  },
});

export const createUser = mutation({
  args: { username: v.string(), email: v.string(), password: v.string() },
  // args: {},
  handler: async (ctx, { username, email, password }) => {
    return await ctx.db.insert("users", {
      username,
      email,
      password,
    });
  },
});
