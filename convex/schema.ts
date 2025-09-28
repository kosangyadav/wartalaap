import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.optional(v.string()),
    password: v.string(),
  }).index("by_username", ["username"]),

  conversations: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(), // true for group chats, false for 1 on 1 chats
    pairKey: v.optional(v.string()), // unique key for easing the query the existence of 1 on 1 chats
  })
    .index("by_name", ["name"])
    .index("by_pairKey", ["pairKey"]),

  conversation_members: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_content", ["content"]),
});
