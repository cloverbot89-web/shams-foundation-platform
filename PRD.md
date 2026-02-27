# Shams Foundation Collaboration Platform
## Product Requirements Document (PRD)

**Document Version:** 1.0  
**Date:** 2026-02-27  
**Status:** Draft  

---

## 1. Executive Summary

The Shams Foundation Collaboration Platform is a web-based workspace designed to coordinate fundraising, relationship-building, and program activities across a distributed team of volunteers and staff. The platform enables multiple people to easily sign in, discover what needs to be done, report accomplishments, and collaborate asynchronously on a shared mission.

**Core Metaphor:** A puzzle where different people work on different pieces at different times, seeing the whole picture come together.

---

## 2. Problem Statement

Currently, the Shams Foundation lacks a centralized, accessible way to:
- Coordinate fundraising activities across multiple people
- Track relationship-building initiatives and outreach
- View and update task progress in real-time
- Share files and resources collaboratively
- Maintain context and institutional memory of conversations and decisions
- Onboard new volunteers/staff quickly without friction

Existing solutions (email, spreadsheets, separate tools) create silos, duplicated effort, and lost context. A unified platform with minimal friction to join and participate is needed.

---

## 3. User Groups

### Primary Users
- **Fundraising Coordinators:** Lead fundraising campaigns, track donor relationships, set goals
- **Relationship Managers:** Coordinate outreach, partnership building, stakeholder management
- **Program Staff:** Execute programs, report updates, track milestones
- **Volunteers:** Contribute to specific activities, report progress, access resources
- **Executive/Leadership:** Oversee strategy, view high-level metrics, make decisions

### Secondary Users
- **Donors:** View impact metrics, receive updates (if integrated)
- **Partners:** Access shared project information, coordinate activities

---

## 4. Key Features

### 4.1 Authentication & Access
**Requirement:** Simple, frictionless sign-up and login

- **Google OAuth Integration**
  - One-click sign-in with Google account
  - No password to remember
  - Automatic profile creation from Google account
  - Email-based access control and invitations

- **Invite System**
  - Admin sends invite links (email-based)
  - One-click access — no complex onboarding
  - Role assignment at invite time (Fundraiser, Coordinator, Volunteer, Viewer, Admin)

- **Role-Based Access Control**
  - Admin: Full platform access, user management, configuration
  - Coordinator: Create/edit tasks, view all activity, manage team
  - Contributor: Create/edit own tasks, report progress, access resources
  - Viewer: Read-only access to view progress and metrics

---

### 4.2 Dashboard & Task Discovery
**Requirement:** Easy to find what needs to get done

- **Main Dashboard**
  - Personalized view of tasks assigned to you
  - High-priority items surfaced first
  - Quick stats: tasks due this week, completed this month, in-progress activities
  - Filter/search by category (Fundraising, Outreach, Programs, etc.)

- **Task Board (Kanban View)**
  - Columns: Not Started, In Progress, Done, Blocked
  - Drag-and-drop to update status
  - Color-coded by category
  - Team view option to see everyone's work

- **Task Details**
  - Title, description, due date, assignee(s)
  - Category/tags (Fundraising, Outreach, Program, Research, etc.)
  - Priority level
  - Linked tasks/dependencies
  - Comments and activity feed

- **Calendar View**
  - Upcoming deadlines and milestones
  - Fundraising campaign timeline
  - Event dates and relationship touchpoints
  - Sync to personal Google Calendar (optional)

---

### 4.3 Activity Tracking & Reporting
**Requirement:** Record what's been accomplished, not just what's planned

- **Activity Log**
  - Automatic logging of task completions, status changes, comments
  - Timestamped activity feed (platform-wide and per-task)
  - Filter by user, category, date range
  - Search across activities

- **Progress Updates**
  - One-click buttons: "Mark Complete," "Add Update," "Blocked/Help Needed"
  - Comment field for context (what was accomplished, blockers, next steps)
  - Attachment support (images, documents, proof of accomplishment)
  - @mentions to tag relevant team members

- **Fundraising Tracker**
  - Track individual donations/pledges
  - Campaign progress toward goals
  - Donor relationship timeline
  - Mercury API integration (if configured)
    - Auto-sync donation data if Mercury account linked
    - Display total raised, pending, and goals
  - Manual entry fallback for offline donations

---

### 4.4 File & Resource Management
**Requirement:** Easy file sharing and centralized resource access

- **File Uploads**
  - Drag-and-drop upload to tasks or shared folders
  - Supported: PDFs, images, documents (Google Docs embeds), spreadsheets
  - File versioning and history
  - Organized by category/project

- **Shared Library**
  - Central resource hub for templates, guides, donor lists, talking points
  - Browse by category
  - Search and filter
  - Version control and update tracking

- **Integration Notes**
  - Link Google Docs/Sheets directly (embedded preview)
  - Access without leaving platform

---

### 4.5 Collaboration & Communication
**Requirement:** Coordinate without leaving the platform

- **Task Comments**
  - Threaded discussion on each task
  - @mentions to tag team members for urgent input
  - Auto-notifications when mentioned or replied to

- **Teams/Groups**
  - Organize by function: Fundraising Team, Outreach Team, Programs Team
  - Team channels for broader conversations
  - Team-specific task boards and resources

- **Real-time Notifications**
  - Email digest (daily or weekly)
  - In-app notifications for mentions, task assignments, deadline reminders
  - Customizable notification preferences

---

### 4.6 AI-Powered Chat Bot & Search
**Requirement:** Search and summarize context, provide intelligent assistance

- **Unified Search**
  - Search tasks, comments, files, activities across entire platform
  - Full-text search with filters (date, category, assigned to, status)
  - Quick preview of results

- **Chat Bot Features**
  - **Ask Questions:** "Who's working on fundraising this month?" or "What's the status of the donor outreach initiative?"
  - **Search Corpus:** Indexed search over all tasks, comments, files, activity logs
  - **Generate Summaries:** "Summarize all completed activities this week" or "What's blocked right now?"
  - **Conversational Context:** Remember conversation history within session
  - **Suggest Next Steps:** "Based on what's been done, here are recommended next actions"
  - **Find Related Info:** Automatically link relevant tasks, conversations, and resources
  - **Trend Analysis:** "We've completed 15 outreach activities this month, trending toward goal"

- **Chat Interface**
  - Sidebar widget or dedicated page
  - Conversational query format (plain English)
  - AI-powered responses with links to relevant tasks/data
  - History and saved searches

---

### 4.7 Metrics & Reporting
**Requirement:** Track impact and progress toward goals

- **Dashboard Widgets**
  - Tasks completed this week/month/quarter
  - Fundraising progress toward goal
  - Number of relationships touched/engaged
  - Program participation metrics
  - Team activity heatmap

- **Custom Reports**
  - Generate reports by date range, team, category
  - Export to CSV or PDF
  - Share with stakeholders

- **Insights**
  - Velocity tracking (tasks completed over time)
  - Team productivity metrics (non-intrusive)
  - Bottlenecks and blockers identified
  - Trends and patterns

---

## 5. User Experience & Design

### Information Architecture
- **Navigation:** Clear primary nav (Dashboard, Tasks, Fundraising, Teams, Resources, Chat)
- **Hierarchy:** Dashboard → Tasks/Activities → Details
- **Discoverability:** Search and filter prominent on every view

### Design Principles
- **Simplicity First:** New users should understand the platform within 2 minutes
- **Mobile-Friendly:** Works on phone for quick status updates while traveling
- **Accessibility:** WCAG AA compliance, keyboard navigation
- **Speed:** Fast load times, instant updates, no friction

### Onboarding
- Welcome wizard on first login
- Quick tutorial (skip available)
- Pre-populated sample tasks/templates
- Links to help docs

---

## 6. Technical Architecture

### Frontend
- **Framework:** React or Vue (fast, lightweight)
- **Real-time Updates:** WebSocket for live notifications
- **Offline Support:** Service worker for offline task viewing/editing
- **Mobile:** Responsive design, PWA for app-like experience

### Backend
- **API:** REST or GraphQL
- **Database:** PostgreSQL for relational data (tasks, users, files)
- **Search:** Elasticsearch or similar for full-text search and AI chat context
- **Storage:** S3-compatible for file uploads
- **Authentication:** OAuth 2.0 (Google), JWT tokens

### Integrations
- **Google OAuth:** Authentication
- **Mercury API:** Donation/fundraising data sync (optional)
- **Google Drive:** File embedding and sync
- **Slack/Email:** Notifications (phase 2)

### AI/Chat Bot
- **LLM Integration:** OpenAI API or similar for chat capabilities
- **Vector Search:** Embeddings for semantic search over platform content
- **RAG (Retrieval Augmented Generation):** Ground responses in actual platform data
- **Context Window:** Maintain conversation history within session

---

## 7. Data Security & Privacy

- **Encryption:** TLS for transit, at-rest encryption for sensitive data
- **Access Control:** Role-based, enforced server-side
- **Audit Logs:** All actions logged and traceable
- **GDPR/Privacy:** Compliant with data protection regulations
- **Backup:** Regular automated backups, disaster recovery plan

---

## 8. Implementation Phases

### Phase 1: MVP (Weeks 1-4)
- User authentication (Google OAuth)
- Task creation, assignment, status tracking
- Dashboard and task board (Kanban)
- Comments and basic file uploads
- Basic notifications

### Phase 2: Enhanced Collaboration (Weeks 5-8)
- Teams/groups
- Fundraising tracker
- Activity timeline/feed
- Advanced search

### Phase 3: AI & Intelligence (Weeks 9-12)
- Chat bot with corpus search
- Summarization and insights
- Advanced filtering and reporting

### Phase 4: Integrations & Polish (Weeks 13-16)
- Mercury API integration
- Google Drive embed
- Slack/email notifications
- Mobile app optimization
- Analytics and metrics

---

## 9. Success Metrics

- **Adoption:** 80% of invited users active within 1 month
- **Engagement:** Average 2+ actions per user per day
- **Task Completion:** 90% of created tasks tracked to completion
- **Time Saved:** User feedback indicates 50% less time spent coordinating
- **Fundraising Impact:** Increased tracking accuracy, visibility into donor pipeline
- **User Satisfaction:** NPS score > 50

---

## 10. Dependencies & Constraints

- **Google OAuth API:** Requires setup and credentials
- **Mercury Account (Optional):** For fundraising sync
- **Hosting:** Cloud infrastructure (AWS, Vercel, Heroku)
- **API Rate Limits:** LLM costs scale with usage

---

## 11. Known Unknowns / Future Exploration

- Offline-first architecture (full sync capability without internet)
- Mobile native app (iOS/Android)
- Integration with CRM systems (Salesforce, HubSpot)
- Advanced analytics dashboard
- Custom workflow automation
- Email-to-task creation
- Video/voice recording of accomplishments

---

## 12. Glossary

- **Task:** Discrete unit of work with assignee, deadline, category
- **Activity:** Action taken (task created, comment added, status changed)
- **Team:** Group of users organized by function
- **Category:** Label/tag for organizing tasks (Fundraising, Outreach, Program, etc.)
- **Corpus:** All searchable content (tasks, comments, files, activity)

---

## Appendix: User Stories

### Story 1: New Volunteer Joins Fundraising
*"As a new volunteer, I want to quickly sign up and see what fundraising activities I can help with, so I can start contributing immediately without friction."*

**Acceptance Criteria:**
- Click invite link, sign in with Google, land on dashboard in <2 minutes
- Dashboard shows 3-5 available fundraising tasks
- Can pick one and update status to "In Progress" with one click

### Story 2: Fundraiser Tracks Campaign Progress
*"As a fundraising coordinator, I want to see all ongoing fundraising campaigns and their progress toward goal, so I can identify which need attention and celebrate wins."*

**Acceptance Criteria:**
- Fundraising dashboard shows all active campaigns
- Each campaign displays total raised, goal, percentage toward goal, contributors
- Can drill into campaign to see individual donations/pledges and next steps

### Story 3: Team Lead Understands Blockers
*"As a team lead, I want to quickly see what's blocked or stuck, so I can unblock the team and keep momentum going."*

**Acceptance Criteria:**
- Dashboard highlights tasks marked "Blocked" with reason
- Can filter to show only blocked tasks
- Can @mention relevant person to help unblock

### Story 4: Executive Gets Weekly Summary
*"As executive director, I want a quick summary of what was accomplished this week and what's coming up, so I can stay informed and celebrate progress."*

**Acceptance Criteria:**
- Weekly digest email shows tasks completed, goals progressed, upcoming deadlines
- Can click through to platform for detailed view
- Customizable digest frequency/content

### Story 5: Bot Answers Strategic Questions
*"As a program manager, I want to ask the platform 'How many people have we reached in the last month?' and get an accurate answer based on our logged activities."*

**Acceptance Criteria:**
- Chat bot understands natural language question
- Searches task/activity corpus for relevant entries
- Returns count with source data (linked tasks)
- Can drill into results for details

---

## Document Sign-Off

**Prepared by:** Clover (AI Assistant)  
**For:** Shams Foundation Leadership  
**Review Status:** Ready for feedback and iteration  

---

*This PRD is a living document. Updates and refinements are welcome and encouraged as we gather feedback from stakeholders.*
