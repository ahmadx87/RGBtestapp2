var routes = [

  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  
  // About page
  {
    path: '/animationsett/',
    url: './pages/animationsett.html',
    name: 'about',
  },
  
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
