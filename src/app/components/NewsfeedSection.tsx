import { useState } from "react";
import type { NewsfeedItem } from "@/lib/store-api";
import { Calendar, X } from "lucide-react";

interface NewsfeedSectionProps {
  newsfeeds: NewsfeedItem[];
  isLoading: boolean;
}

export function NewsfeedSection({ newsfeeds, isLoading }: NewsfeedSectionProps) {
  const [selectedNewsfeed, setSelectedNewsfeed] = useState<NewsfeedItem | null>(null);

  // Format the date nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <section className="py-16 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Latest News & Updates
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Stay informed with the latest happenings, community stories, and product announcements.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-[#6B7280]">Loading newsfeed...</div>
        ) : newsfeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-[#CBD5E1]">
            <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-[#94A3B8]" />
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">No News Yet</h3>
            <p className="text-[#64748B] text-center max-w-md">
              We don't have any updates to share at the moment. Please check back later for the latest news!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsfeeds.map((item) => (
              <article 
                key={item.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                {item.image && (
                  <div className="relative h-56 overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-[#64748B] mb-3">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3 line-clamp-2 group-hover:text-[#16A34A] transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#475569] line-clamp-2 mb-4 flex-grow">
                    {item.content}
                  </p>
                  
                  <button 
                    onClick={() => setSelectedNewsfeed(item)}
                    className="text-[#16A34A] font-bold text-sm inline-flex items-center gap-1 hover:text-[#15803D] transition-colors mt-auto w-fit"
                  >
                    Read More 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal for reading more */}
      {selectedNewsfeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedNewsfeed(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-[#475569] hover:text-[#0F172A] transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto p-0">
              {selectedNewsfeed.image && (
                <div className="w-full h-64 sm:h-80 bg-[#F1F5F9]">
                  <img 
                    src={selectedNewsfeed.image} 
                    alt={selectedNewsfeed.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm text-[#64748B] mb-4">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={selectedNewsfeed.created_at}>
                    {formatDate(selectedNewsfeed.created_at)}
                  </time>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-6">
                  {selectedNewsfeed.title}
                </h2>
                
                <div className="prose prose-slate max-w-none text-[#475569] whitespace-pre-wrap">
                  {selectedNewsfeed.content}
                </div>
              </div>
            </div>
          </div>
          
          {/* Click outside to close (background layer) */}
          <div 
            className="absolute inset-0 z-[-1]" 
            onClick={() => setSelectedNewsfeed(null)} 
          />
        </div>
      )}
    </section>
  );
}
