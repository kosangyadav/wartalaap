import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// to be used in selectedChat.tsx
export const getMsgsInConversation = query({
  args: { conversationId: v.optional(v.id("conversations")) },
  handler: async (ctx, { conversationId }) => {
    // If no conversationId is provided, return an empty array
    if (!conversationId) {
      return [];
    }
    // Fetch messages in the specified conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId),
      )
      // .order("desc")
      .take(50);
    return messages;
  },
});

export const sendMsgToConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, { conversationId, senderId, content }) => {
    // Insert a new message into the specified conversation
    const newMessage = await ctx.db.insert("messages", {
      conversationId,
      senderId,
      content,
    });
    return newMessage;
  },
});

export const getConversationWithId = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    return await ctx.db.get(conversationId);
  },
});

//to be used in sidebar.tsx
export const queryUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Fetch conversation memberships for the user
    const memberships = await ctx.db
      .query("conversation_members")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    console.log({ memberships });

    // Extract conversation IDs from memberships
    const conversationIds = memberships.map((m) => m.conversationId);

    console.log({ conversationIds });

    if (conversationIds.length === 0) {
      return [];
    }

    const conversations = [];

    for (const id of conversationIds) {
      conversations.push(await ctx.db.get(id));
    }

    console.log({ conversations });
    return conversations;
  },
});

export const getUsers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const getUsernameById = action({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.runQuery(internal.conversation.getUsers, { userId });
    return user?.username;
  },
});
