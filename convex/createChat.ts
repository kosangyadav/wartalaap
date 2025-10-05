import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

// const getConversationsList = query({
//   args: { userId: v.id("users") },
//   handler: async (ctx, { userId }) => {
//     await ctx.db.query("conversation_members").withIndex("by_id", (q) => q.eq("userId", userId)).collect();
// });

export const getUsers = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.gte("username", username))
      .take(20);
  },
});

export const getUsersByUsername = action({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    console.log("getUsersByUsername : ", { username });
    return await ctx.runQuery(internal.createChat.getUsers, { username });
  },
});

export const checkExisting1on1Conversation = query({
  args: { pairKey: v.string() },
  handler: async (ctx, { pairKey }) => {
    // Check if a conversation between these two users already exists
    const existingConversations = await ctx.db
      .query("conversations")
      .withIndex("by_pairKey", (q) => q.eq("pairKey", pairKey))
      .first();

    console.log(existingConversations);
    if (!existingConversations) {
      return null;
    }
    console.log("checkExisting1on1Conversation : ", {
      pairKey,
      ConversationId: existingConversations?._id,
    });
    // Return the existing conversation ID
    return existingConversations?._id;
  },
});

export const create1on1Conversation = mutation({
  args: { userId1: v.id("users"), userId2: v.id("users") },
  handler: async (ctx, { userId1, userId2 }) => {
    console.log("Creating 1-on-1 conversation between:", userId1, userId2);
    const [u1, u2] = [userId1, userId2].sort();
    const pairKey = `${u1}:${u2}`;

    const conversationId = await ctx.runQuery(
      internal.createChat.checkExisting1on1Conversation,
      { pairKey },
    );

    if (conversationId) {
      // Conversation already exists, return the existing conversation ID
      return conversationId;
    }

    // Create a new conversation
    const conversation = await ctx.db.insert("conversations", {
      isGroup: false,
      pairKey,
    });

    console.log("Created new 1o1 conversation with ID:", conversation);

    // Add both users to the conversation
    await ctx.db.insert("conversation_members", {
      conversationId: conversation,
      userId: userId1,
    });
    await ctx.db.insert("conversation_members", {
      conversationId: conversation,
      userId: userId2,
    });

    return conversation;
  },
});

export const createGroupConversation = mutation({
  args: { name: v.string(), memberIds: v.array(v.id("users")) },
  handler: async (ctx, { name, memberIds }) => {
    // Create a new group conversation
    const conversation = await ctx.db.insert("conversations", {
      name,
      isGroup: true,
    });

    // Add all members to the conversation
    for (const memberId of memberIds) {
      await ctx.db.insert("conversation_members", {
        conversationId: conversation,
        userId: memberId,
      });
    }
    console.log("createGroupConversation : ", { conversation });
    return conversation;
  },
});
