import { Node, Edge } from 'reactflow';

// Define the initial nodes
export const initialNodes: Node[] = [
  // Section Labels
  {
    id: 'label-student-flow',
    type: 'default',
    position: { x: 600, y: 0 },
    data: { label: 'STUDENT FLOW' },
    style: {
      background: 'transparent',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1a56db',
      textAlign: 'center',
      width: 200
    },
  },
  {
    id: 'label-admin-flow',
    type: 'default',
    position: { x: 1700, y: 0 },
    data: { label: 'ADMIN FLOW' },
    style: {
      background: 'transparent',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#16a34a',
      textAlign: 'center',
      width: 200
    },
  },
  // Student Flow Nodes - Level 1
  {
    id: 'student-open',
    type: 'studentNode',
    position: { x: 600, y: 50 },
    data: {
      label: 'Student Opens Website',
      description: 'Student visits nbkrstudenthub.me to access academic information',
      icon: 'user',
      category: 'student'
    },
  },

  // Student Flow Nodes - Level 2
  {
    id: 'student-choose',
    type: 'studentNode',
    position: { x: 600, y: 200 },
    data: {
      label: 'Choose Option',
      description: 'Student selects how to search for their information',
      icon: 'search',
      category: 'student'
    },
  },
  {
    id: 'store-session',
    type: 'systemNode',
    position: { x: 900, y: 50 },
    data: {
      label: 'Store Session Timestamp',
      description: 'Save user session data in Supabase',
      icon: 'cpu',
      category: 'core'
    },
  },
  {
    id: 'show-count',
    type: 'systemNode',
    position: { x: 900, y: 200 },
    data: {
      label: 'Show Live User Count',
      description: 'Display real-time visitor count on homepage',
      icon: 'layers',
      category: 'core'
    },
  },

  // Student Flow Nodes - Level 3
  {
    id: 'student-roll',
    type: 'studentNode',
    position: { x: 300, y: 350 },
    data: {
      label: 'Search by Roll Number',
      description: 'Enter roll number to directly access student data',
      icon: 'search',
      category: 'student'
    },
  },
  {
    id: 'student-name',
    type: 'studentNode',
    position: { x: 600, y: 350 },
    data: {
      label: 'Search by Name + Year',
      description: 'Find student by name and academic year/semester',
      icon: 'search',
      category: 'student'
    },
  },
  {
    id: 'student-blog',
    type: 'studentNode',
    position: { x: 900, y: 350 },
    data: {
      label: 'Submit Blog',
      description: 'Students can submit blog posts for approval',
      icon: 'file',
      category: 'student'
    },
  },
  {
    id: 'student-logo',
    type: 'studentNode',
    position: { x: 1200, y: 350 },
    data: {
      label: 'Upload College Logo',
      description: 'Students can submit college logo designs',
      icon: 'upload',
      category: 'student'
    },
  },

  // Data Query Nodes - Level 4
  {
    id: 'query-roll',
    type: 'dataNode',
    position: { x: 300, y: 500 },
    data: {
      label: 'Query Supabase',
      description: 'System queries Supabase storage for student data using roll number',
      icon: 'database',
      category: 'data'
    },
  },
  {
    id: 'query-name',
    type: 'dataNode',
    position: { x: 600, y: 500 },
    data: {
      label: 'Query with Filters',
      description: 'System searches Supabase with name and year filters',
      icon: 'database',
      category: 'data'
    },
  },
  {
    id: 'store-blog',
    type: 'dataNode',
    position: { x: 900, y: 500 },
    data: {
      label: 'Store Blog in Supabase',
      description: 'Save blog post with pending status in Supabase',
      icon: 'storage',
      category: 'data'
    },
  },
  {
    id: 'store-logo',
    type: 'dataNode',
    position: { x: 1200, y: 500 },
    data: {
      label: 'Store Logo in Supabase',
      description: 'Save logo design with pending status in Supabase',
      icon: 'storage',
      category: 'data'
    },
  },

  // Data Query Nodes - Level 5
  {
    id: 'show-info-1',
    type: 'dataNode',
    position: { x: 300, y: 650 },
    data: {
      label: 'Show Student Info',
      description: 'Display student details, attendance, and mid-term marks',
      icon: 'json',
      category: 'data'
    },
  },
  {
    id: 'show-matches',
    type: 'dataNode',
    position: { x: 600, y: 650 },
    data: {
      label: 'Show Matching Roll Numbers',
      description: 'Display list of students matching the search criteria',
      icon: 'json',
      category: 'data'
    },
  },

  // Data Query Nodes - Level 6
  {
    id: 'fetch-by-roll',
    type: 'dataNode',
    position: { x: 600, y: 800 },
    data: {
      label: 'Fetch Data by Roll Number',
      description: 'Retrieve complete student data using selected roll number',
      icon: 'json',
      category: 'data'
    },
  },

  // Data Query Nodes - Level 7
  {
    id: 'show-info-2',
    type: 'dataNode',
    position: { x: 600, y: 950 },
    data: {
      label: 'Show Student Info',
      description: 'Display student details, attendance, and mid-term marks',
      icon: 'json',
      category: 'data'
    },
  },

  // Admin Flow Nodes - Separate Tree - Level 1
  {
    id: 'admin-login',
    type: 'adminNode',
    position: { x: 1700, y: 50 },
    data: {
      label: 'Admin Logs into Dashboard',
      description: 'Administrator accesses secure admin dashboard',
      icon: 'shield',
      category: 'admin'
    },
  },

  // Admin Flow Nodes - Level 2
  {
    id: 'admin-secure',
    type: 'adminNode',
    position: { x: 1700, y: 200 },
    data: {
      label: 'Secure Login Required',
      description: 'Authentication required for admin access',
      icon: 'shield',
      category: 'admin'
    },
  },

  // Admin Flow Nodes - Level 3
  {
    id: 'admin-blogs',
    type: 'adminNode',
    position: { x: 1400, y: 350 },
    data: {
      label: 'View Pending Blogs',
      description: 'Admin reviews submitted blog posts',
      icon: 'check',
      category: 'admin'
    },
  },
  {
    id: 'admin-logos',
    type: 'adminNode',
    position: { x: 1700, y: 350 },
    data: {
      label: 'View Pending Logos',
      description: 'Admin reviews submitted logo designs',
      icon: 'check',
      category: 'admin'
    },
  },
  {
    id: 'admin-update',
    type: 'adminNode',
    position: { x: 2000, y: 350 },
    data: {
      label: 'Update Student Data',
      description: 'Admin initiates data update process',
      icon: 'refresh',
      category: 'admin'
    },
  },

  // Admin Flow Nodes - Level 4
  {
    id: 'admin-approve-blog',
    type: 'adminNode',
    position: { x: 1400, y: 500 },
    data: {
      label: 'Approve Blog',
      description: 'Admin approves blog post for publication',
      icon: 'check',
      category: 'admin'
    },
  },
  {
    id: 'admin-approve-logo',
    type: 'adminNode',
    position: { x: 1700, y: 500 },
    data: {
      label: 'Approve Logo',
      description: 'Admin approves logo for display',
      icon: 'check',
      category: 'admin'
    },
  },
  {
    id: 'trigger-flashapi',
    type: 'systemNode',
    position: { x: 2000, y: 500 },
    data: {
      label: 'Trigger FlashAPI Scripts',
      description: 'Runs 4 Python scripts on Railway platform',
      icon: 'code',
      category: 'data'
    },
  },

  // Admin Flow Nodes - Level 5
  {
    id: 'blog-visible',
    type: 'adminNode',
    position: { x: 1400, y: 650 },
    data: {
      label: 'Blog Visible on Website',
      description: 'Approved blog appears on the website',
      icon: 'check',
      category: 'admin'
    },
  },
  {
    id: 'logo-visible',
    type: 'adminNode',
    position: { x: 1700, y: 650 },
    data: {
      label: 'Logo Displayed on Website',
      description: 'Approved logo appears on the website',
      icon: 'check',
      category: 'admin'
    },
  },
  {
    id: 'data-to-supabase',
    type: 'dataNode',
    position: { x: 2000, y: 650 },
    data: {
      label: 'Data → Supabase',
      description: 'Scraped data is uploaded to Supabase storage',
      icon: 'database',
      category: 'data'
    },
  },
];

// Define the initial edges
export const initialEdges: Edge[] = [
  // Student Flow Edges - Vertical connections (parent to child)
  {
    id: 'e-student-open-choose',
    source: 'student-open',
    target: 'student-choose',
    type: 'animated',
    animated: true,
    data: { label: 'Visits', color: '#1a56db' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-student-choose-roll',
    source: 'student-choose',
    target: 'student-roll',
    type: 'animated',
    animated: true,
    data: { label: 'Option 1', color: '#1a56db' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-student-choose-name',
    source: 'student-choose',
    target: 'student-name',
    type: 'animated',
    animated: true,
    data: { label: 'Option 2', color: '#1a56db' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-student-choose-blog',
    source: 'student-choose',
    target: 'student-blog',
    type: 'animated',
    animated: true,
    data: { label: 'Option 3', color: '#1a56db' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-student-choose-logo',
    source: 'student-choose',
    target: 'student-logo',
    type: 'animated',
    animated: true,
    data: { label: 'Option 4', color: '#1a56db' },
    sourceHandle: null,
    targetHandle: null,
  },

  // Horizontal connections between sibling nodes
  {
    id: 'e-student-roll-name',
    source: 'student-roll',
    target: 'student-name',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#1a56db' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },
  {
    id: 'e-student-name-blog',
    source: 'student-name',
    target: 'student-blog',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#1a56db' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },
  {
    id: 'e-student-blog-logo',
    source: 'student-blog',
    target: 'student-logo',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#1a56db' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },

  // Student to Data connections - Vertical
  {
    id: 'e-student-roll-query',
    source: 'student-roll',
    target: 'query-roll',
    type: 'animated',
    animated: true,
    data: { label: 'Query by Roll Number', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-student-name-query',
    source: 'student-name',
    target: 'query-name',
    type: 'animated',
    animated: true,
    data: { label: 'Query by Name & Year', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-student-blog-store',
    source: 'student-blog',
    target: 'store-blog',
    type: 'animated',
    animated: true,
    data: { label: 'Submit', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-student-logo-store',
    source: 'student-logo',
    target: 'store-logo',
    type: 'animated',
    animated: true,
    data: { label: 'Upload', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
  },

  // Horizontal connections between data nodes
  {
    id: 'e-query-roll-query-name',
    source: 'query-roll',
    target: 'query-name',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#9333ea' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },
  {
    id: 'e-query-name-store-blog',
    source: 'query-name',
    target: 'store-blog',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#9333ea' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },
  {
    id: 'e-store-blog-store-logo',
    source: 'store-blog',
    target: 'store-logo',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#9333ea' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },

  // Data flow - Vertical connections
  {
    id: 'e-query-roll-info',
    source: 'query-roll',
    target: 'show-info-1',
    type: 'animated',
    animated: true,
    data: { label: 'Display', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-query-name-matches',
    source: 'query-name',
    target: 'show-matches',
    type: 'animated',
    animated: true,
    data: { label: 'Results', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-matches-fetch',
    source: 'show-matches',
    target: 'fetch-by-roll',
    type: 'animated',
    animated: true,
    data: { label: 'Select Student', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
    style: { strokeWidth: 3 },
  },
  {
    id: 'e-fetch-info',
    source: 'fetch-by-roll',
    target: 'show-info-2',
    type: 'animated',
    animated: true,
    data: { label: 'Display Complete Info', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
    style: { strokeWidth: 3 },
  },

  // Horizontal connection between data results
  {
    id: 'e-show-info-1-show-matches',
    source: 'show-info-1',
    target: 'show-matches',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#9333ea' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },

  // Live User Tracking - Horizontal and Vertical
  {
    id: 'e-student-open-session',
    source: 'student-open',
    target: 'store-session',
    type: 'animated',
    animated: true,
    data: { label: 'Track', color: '#ea580c' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
    style: { strokeDasharray: '5, 5' },
  },
  {
    id: 'e-session-count',
    source: 'store-session',
    target: 'show-count',
    type: 'animated',
    animated: true,
    data: { label: 'Count', color: '#ea580c' },
    sourceHandle: null,
    targetHandle: null,
    style: { strokeDasharray: '5, 5' },
  },

  // Admin Flow - Vertical connections
  {
    id: 'e-admin-login-secure',
    source: 'admin-login',
    target: 'admin-secure',
    type: 'animated',
    animated: true,
    data: { label: 'Login', color: '#16a34a' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-admin-secure-blogs',
    source: 'admin-secure',
    target: 'admin-blogs',
    type: 'animated',
    animated: true,
    data: { label: 'Access', color: '#16a34a' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-admin-secure-logos',
    source: 'admin-secure',
    target: 'admin-logos',
    type: 'animated',
    animated: true,
    data: { label: 'Access', color: '#16a34a' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-admin-secure-update',
    source: 'admin-secure',
    target: 'admin-update',
    type: 'animated',
    animated: true,
    data: { label: 'Access', color: '#16a34a' },
    sourceHandle: null,
    targetHandle: null,
  },

  // Admin Flow - Horizontal connections between siblings
  {
    id: 'e-admin-blogs-logos',
    source: 'admin-blogs',
    target: 'admin-logos',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#16a34a' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },
  {
    id: 'e-admin-logos-update',
    source: 'admin-logos',
    target: 'admin-update',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#16a34a' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },

  // Admin Flow - Vertical connections for approval process
  {
    id: 'e-admin-blogs-approve',
    source: 'admin-blogs',
    target: 'admin-approve-blog',
    type: 'animated',
    animated: true,
    data: { label: 'Review', color: '#16a34a' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-admin-logos-approve',
    source: 'admin-logos',
    target: 'admin-approve-logo',
    type: 'animated',
    animated: true,
    data: { label: 'Review', color: '#16a34a' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-admin-update-flashapi',
    source: 'admin-update',
    target: 'trigger-flashapi',
    type: 'animated',
    animated: true,
    data: { label: 'Trigger', color: '#ea580c' },
    sourceHandle: null,
    targetHandle: null,
  },

  // Admin Flow - Horizontal connections between approval nodes
  {
    id: 'e-admin-approve-blog-logo',
    source: 'admin-approve-blog',
    target: 'admin-approve-logo',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#16a34a' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },
  {
    id: 'e-admin-approve-logo-flashapi',
    source: 'admin-approve-logo',
    target: 'trigger-flashapi',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#16a34a' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },

  // Admin Flow - Final vertical connections
  {
    id: 'e-admin-approve-blog-visible',
    source: 'admin-approve-blog',
    target: 'blog-visible',
    type: 'animated',
    animated: true,
    data: { label: 'Publish', color: '#16a34a' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-admin-approve-logo-visible',
    source: 'admin-approve-logo',
    target: 'logo-visible',
    type: 'animated',
    animated: true,
    data: { label: 'Publish', color: '#16a34a' },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'e-flashapi-supabase',
    source: 'trigger-flashapi',
    target: 'data-to-supabase',
    type: 'animated',
    animated: true,
    data: { label: 'Upload', color: '#9333ea' },
    sourceHandle: null,
    targetHandle: null,
  },

  // Admin Flow - Horizontal connections between final nodes
  {
    id: 'e-blog-visible-logo-visible',
    source: 'blog-visible',
    target: 'logo-visible',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#16a34a' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },
  {
    id: 'e-logo-visible-data-supabase',
    source: 'logo-visible',
    target: 'data-to-supabase',
    type: 'animated',
    animated: true,
    data: { label: '', color: '#16a34a' },
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
  },
];
