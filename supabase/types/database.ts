// Auto-generated Supabase types — regenerate with:
//   supabase gen types typescript --local > supabase/types/database.ts
//
// This file is a placeholder generated from migrations:
//   0001_content_engine.sql
//   0002_rls_policies.sql

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          status: "draft" | "active" | "archived"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          status?: "draft" | "active" | "archived"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          status?: "draft" | "active" | "archived"
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      updates: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "updates_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string
          result: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string
          result?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string
          result?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiments_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          id: string
          project_id: string | null
          url: string
          type: "image" | "video" | "file" | "link"
          meta: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          url: string
          type: "image" | "video" | "file" | "link"
          meta?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          url?: string
          type?: "image" | "video" | "file" | "link"
          meta?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_tags: {
        Row: {
          project_id: string
          tag_id: string
        }
        Insert: {
          project_id: string
          tag_id: string
        }
        Update: {
          project_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tags_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
