import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const Permissions = React.lazy(() => import('./views/pages/permissions/Permissions'))

// Base
const Upload = React.lazy(() => import('./views/base/upload/Upload'))
const Validate = React.lazy(() => import('./views/base/validate/Validate'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const ReusableUpload = React.lazy(() => import('./views/base/upload-reusable/ReusableUpload'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/upload', name: 'Upload', component: Upload },
  { path: '/validate', name: 'Validate', component: Validate },
  { path: '/template', name: 'My Template', component: ReusableUpload },
  { path: '/permissions', name: 'Permissions', component: Permissions },
]

export default routes
