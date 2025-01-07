import React, { useEffect} from 'react'; 

const MySchool = () => {
  const quickLinks = [
    { title: 'Student Portal', icon: 'fa-users', href: 'https://portal.mu.ac.ke/' },
    { title: 'E-Learning(Musomi)', icon: 'fa-book', href: 'https://elearning.mu.ac.ke/login/index.php' },
    { title: 'HEF/HELB', icon: 'fas fa-sign-in-alt', href: 'https://portal.hef.co.ke/auth/signin' },
    { title: 'Exams Timetable', icon: 'fa-calendar-alt', href: 'https://www.mu.ac.ke/index.php/en/student/examination-timetables.html' },
  ];

  const blogs = [
    {
      title: 'How to Register Units',
      excerpt: 'A comprehensive guide to course registration for new and continuing students. Learn about prerequisites, core units, and electives.',
      date: 'March 15, 2025',
      category: 'Academic Guide',
      readTime: '5 min read',
      href: '#',
    },
    {
      title: 'Accessing Library Resources Online',
      excerpt: 'Step-by-step tutorial on how to access e-books, journals, and research papers through the university library portal.',
      date: 'March 10, 2025',
      category: 'Resources',
      readTime: '4 min read',
      href: '#',
    },
    {
      title: 'Campus Life Guide',
      excerpt: 'Everything you need to know about accommodation, dining, clubs, and social life at Moi University.',
      date: 'March 5, 2025',
      category: 'Student Life',
      readTime: '8 min read',
      href: '#',
    },
    {
      title: 'Exam Preparation Strategies',
      excerpt: 'Expert tips on how to prepare for your exams, manage study time, and maintain good mental health during exam period.',
      date: 'March 1, 2025',
      category: 'Study Tips',
      readTime: '6 min read',
      href: '#',
    }
  ];

  const categories = ['All Posts', 'Academic Guide', 'Resources', 'Student Life', 'Study Tips'];

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Moi University</h1>
          <p className="text-green-600">Your guide to university life</p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => (
            <div key={link.title} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-green-100">
              <a 
                href={link.href}
                className="p-6 flex flex-col items-center gap-2 text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              >
                <i className={`fas ${link.icon} w-4 h-4`}></i>
                <span className="font-medium">{link.title}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Blog Section */}
        <div className="bg-white rounded-lg border border-green-100 overflow-hidden">
          <div className="bg-green-50 p-6">
            <div className="flex items-center gap-2 text-green-800 text-2xl font-bold mb-2">
              <i className="fas fa-graduation-cap w-6 h-6"></i>
              <h2>Student Guide Blog</h2>
            </div>
            <p className="text-green-600">Helpful articles and guides for Moi University students is coming soon.</p>
          </div>
          
          {/* Category Filters */}
          {/* <div className="px-6 py-4 border-b border-green-100">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap"
                >
                  {category}
                </button>
              ))}
            </div>
          </div> */}

          {/* <div className="p-6">
            <div className="grid gap-6">
              {blogs.map((blog) => (
                <div 
                  key={blog.title} 
                  className="bg-white rounded-lg border border-green-100 hover:bg-green-50 transition-colors group p-6"
                >
                 
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                      <i className="fas fa-book w-3 h-3"></i>
                      <span className="text-sm font-medium">{blog.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <i className="fas fa-clock w-3 h-3"></i>
                      <span className="text-sm">{blog.readTime}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-xl mb-3 text-green-800 group-hover:text-green-700">
                    {blog.title}
                  </h3>
                  <p className="text-green-600 mb-4">{blog.excerpt}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2 text-green-500">
                      <i className="fas fa-calendar-alt w-3 h-3"></i>
                      <span className="text-sm">{blog.date}</span>
                    </div>
                    <a 
                      href={blog.href}
                      className="inline-flex items-center gap-2 px-4 py-2 text-green-700 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      Read More
                      <i className="fas fa-arrow-right w-3 h-3"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MySchool;
