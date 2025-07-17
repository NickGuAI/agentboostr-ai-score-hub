# Aura Index Query Record

## Note
The `.aura_index` file was not found in the repository. Analysis was performed by directly exploring the repository structure.

## Query Process and Files Accessed

### 1. Initial Repository Exploration
**Query**: Understanding project structure and technology stack
**Files Accessed**:
- `README.md` - Project overview and setup instructions
- `package.json` - Dependencies and project configuration
- Directory listing of entire repository structure

### 2. Backend Architecture Analysis
**Query**: Understanding backend services and data models
**Files Accessed**:
- `src/integrations/supabase/client.ts` - Supabase client configuration
- `src/integrations/supabase/types.ts` - Database schema and types
- `supabase/functions/analyze-agent/index.ts` - Agent analysis function
- `supabase/functions/calculate-score/index.ts` - Score calculation logic
- `supabase/migrations/` - Database migration files (listed but not read)

### 3. Frontend Architecture Analysis
**Query**: Understanding UI structure and user flows
**Files Accessed**:
- `src/App.tsx` - Main application component with routing
- `src/pages/Index.tsx` - Landing page structure
- `src/pages/Projects.tsx` - Projects listing page
- `src/pages/CreateProject.tsx` - Project creation flow
- `src/contexts/AuthContext.tsx` - Authentication state management

### 4. Component Structure Analysis
**Query**: Understanding component organization
**Files Accessed**:
- `src/components/` directory listing
- Identified UI component library (shadcn-ui) usage
- Component organization pattern (feature components + UI primitives)

## Key Findings from File Analysis

### Technology Stack
- **Frontend**: React + TypeScript + Vite
- **UI Library**: shadcn-ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Routing**: React Router v6

### Architecture Patterns
1. **Database-First Design**: Using Supabase with auto-generated types
2. **Component-Based UI**: Modular React components with shadcn-ui
3. **Edge Functions**: Serverless functions for business logic
4. **Context-Based State**: Simple state management without Redux

### Data Flow
1. User creates project → Stored in Supabase
2. analyze-agent function → Generates mock metrics
3. calculate-score function → Evaluates project performance
4. Frontend displays → Results and visualizations

## Files Not Accessed but Identified as Important
- `src/components/DataVisualization.tsx` - Chart components
- `src/pages/ProjectDetail.tsx` - Individual project view
- `src/pages/Leaderboard.tsx` - Project rankings
- Integration pages for Stripe and GA4 callbacks
- All Supabase migration files
- UI component implementations in `src/components/ui/`

## Conclusion
The analysis was completed successfully without the `.aura_index` file by systematically exploring the repository structure and reading key files to understand the system architecture and identify issues.