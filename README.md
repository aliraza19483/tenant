# Multi-Tenant AI Assistant

A Next.js App Router project showcasing a multi-tenant AI assistant with a config-driven MongoDB admin dashboard.

## Overview & Architecture

This application is built with a strict layered API architecture:
1. **Access Layer** (`lib/access/`): Pure rules determining authorization.
2. **Services Layer** (`lib/services/`): Business logic, data access, and controlled AI flows.
3. **Routes Layer** (`app/api/`): Thin API handlers validating input via Zod.
4. **Hooks/Client Layer** (`@tanstack/react-query`): Server state synchronization.
5. **UI Layer** (`components/` & `app/`): React rendering.

### Multi-Tenant Model
The multi-tenant architecture is scoped strictly around the **Project** entity.
- **Projects**: The core tenant boundary (e.g., `acme`).
- **Product Instances**: Links a product (like "Sales Assistant") to a project. Holds toggleable integrations (Shopify, CRM).
- **Users**: Belong to a `projectId` and hold a `role` (`admin` or `member`).
- **Conversations**: Scoped to both a `projectId` and a `productInstanceId`.
- **DashboardConfig**: Scoped strictly to a `projectId`. 

## Assumptions & Mock Data
- **Integrations**: Shopify and CRM APIs are completely mocked. They return dummy data (e.g., Acme Store orders).
- **AI Backend**: OpenRouter (`openrouter/free`) is used to intelligently route prompts to an open-source model. It incorporates the toggleable integrations by injecting them into the system prompt context. 
- **Authentication**: A simplified session stub is implemented using cookies to demonstrate role-based access control and tenant isolation. 

## Requirements Fulfillment

- **Config-Driven Admin Dashboard**: `DashboardConfig` collection entirely dictates the layout, sections, and widgets shown on `/[slug]/admin`. Modifying this document in the database instantly updates the frontend.
- **Bonus - Unit Tests**: Implemented for pure access rules and Zod schemas using Node's native test runner (`npm run test`).
- **Bonus - `data-testid`**: Main UI regions are decorated with `data-testid` attributes.

## Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file with the following:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/multi-tenant-ai
   OPENROUTER_API_KEY=your_openrouter_key
   ```

3. **Seed Database**
   ```bash
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Admin Config Walkthrough

> **Note for Evaluator:** To view the config-driven admin dashboard in action, edit the `DashboardConfig` document inside your MongoDB database (e.g. using MongoDB Compass). Reorder the widgets array or rename a section label, and you will see the changes instantly reflected on the `/acme/admin` dashboard without touching any code!
