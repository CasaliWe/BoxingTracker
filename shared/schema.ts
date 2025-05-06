import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Tabela de usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  nome: text("nome"),
  email: text("email"),
  telefone: text("telefone"),
  peso: text("peso"),
  altura: text("altura"),
  tempoTreino: text("tempo_treino"),
  academia: text("academia"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

// Tabela para combos de boxe
export const combos = pgTable("combos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  nome: text("nome").notNull(),
  base: text("base").notNull(), // 'destro' ou 'canhoto'
  guarda: text("guarda").notNull(),
  etapas: jsonb("etapas").notNull(), // Array de etapas, cada uma com array de golpes
  dataCriacao: timestamp("data_criacao").defaultNow().notNull(),
  dataModificacao: timestamp("data_modificacao").defaultNow().notNull(),
});

// Relações entre usuários e combos
export const usersRelations = relations(users, ({ many }) => ({
  combos: many(combos),
}));

export const combosRelations = relations(combos, ({ one }) => ({
  user: one(users, {
    fields: [combos.userId],
    references: [users.id],
  }),
}));

// Esquemas para validação
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  nome: true,
  email: true,
  telefone: true,
  peso: true,
  altura: true,
  tempoTreino: true,
  academia: true,
});

export const insertComboSchema = createInsertSchema(combos).omit({
  id: true,
  dataCriacao: true,
  dataModificacao: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCombo = z.infer<typeof insertComboSchema>;
export type Combo = typeof combos.$inferSelect;
