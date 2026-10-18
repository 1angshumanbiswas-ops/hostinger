# ProCRM - Professional Customer Relationship Management System

A modern, full-featured CRM application built with React, Supabase, and TailwindCSS, designed for managing contacts, tracking sales pipelines, and monitoring customer interactions.

## 🚀 Features

### Core CRM Functionality
- **Contact Management**: Create, read, update, and delete contacts with comprehensive customer information
- **Sales Pipeline**: Kanban-style board with drag-and-drop functionality to track deals through Lead → Applying → Paid stages
- **Interaction Timeline**: Log and track all customer interactions (Email, Call, Note, Meeting)
- **Dashboard Analytics**: Real-time metrics including total contacts, conversion rates, pipeline value, and average deal size

### Key Capabilities
- Real-time search and filtering across contacts
- Stage-based contact filtering (Lead/Applying/Paid)
- Deal amount tracking with visual indicators (small/medium/large)
- Expected close date management
- Recent interaction timeline on dashboard
- Responsive design optimized for desktop and mobile
- Professional corporate design with dark mode support

## 📊 Database Schema

### Tables

#### `contacts`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (Text, Required)
- `email` (Text, Required)
- `phone` (Text)
- `company` (Text)
- `address` (Text)
- `status` (Text: Lead/Applying/Paid, Default: Lead)
- `deal_amount` (Numeric, Default: 0)
- `expected_close_date` (Date)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `interactions`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `contact_id` (UUID, Foreign Key to contacts)
- `type` (Text: Email/Call/Note/Meeting)
- `description` (Text, Required)
- `timestamp` (Timestamp)
- `created_by` (Text)

#### `pipeline_stages`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `contact_id` (UUID, Foreign Key to contacts)
- `stage` (Text: Lead/Applying/Paid)
- `moved_at` (Timestamp)

### Row Level Security (RLS)
All tables are protected with RLS policies ensuring users can only access their own data.

## 🎨 Design System

### Color Palette (Corporate/Modern Tech)
- **Primary**: Navy Blue (HSL: 220 80% 25% light / 220 70% 45% dark)
- **Accent**: Teal/Cyan (HSL: 180 60% 45% light / 180 55% 55% dark)
- **Status Colors**:
  - Lead: Blue (#3b82f6)
  - Applying: Yellow (#eab308)
  - Paid: Green (#22c55e)

### Typography
- Font Family: Inter, system fonts
- Clean hierarchy with bold headings
- Readable contrast ratios (WCAG AA compliant)

### Components
Built with shadcn/ui components:
- Card, Badge, Button, Input, Label
- Table, Dialog, Select, Textarea
- Skeleton loaders for async states
- Toast notifications for user feedback

## 🏗️ Application Structure

### Routes
- `/crm` - Dashboard with key metrics and recent activity
- `/crm/contacts` - Contact management table with search/filter
- `/crm/pipeline` - Kanban board for sales pipeline
- `/crm/contact/:id` - Detailed contact view with interaction timeline
- `/crm/settings` - Settings (placeholder for future features)

### Components
- `CRMLayout.jsx` - Main layout wrapper with navigation
- `CRMNavigation.jsx` - Sidebar with app logo and nav links
- `CRMHeader.jsx` - Top header with breadcrumbs and search
- `AddContactModal.jsx` - Form for creating new contacts
- `EditContactModal.jsx` - Form for updating existing contacts
- `AddInteractionModal.jsx` - Form for logging interactions

### Custom Hooks
- `useCRMContacts()` - Manages contact CRUD operations
- `useCRMInteractions()` - Manages interaction logging

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20+
- Supabase account
- Supabase project URL and anon key

### Installation

1. Clone the repository
2. Install dependencies: