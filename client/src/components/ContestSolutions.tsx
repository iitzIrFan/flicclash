import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { YouTubeVideo, searchContestSolutions } from '@/utils/youtube';
import { ExternalLink, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContestSolutionsProps {
  contestName: string;
  channelId: string;
}

export function ContestSolutions({ contestName, channelId }: ContestSolutionsProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      if (!contestName || !channelId) return;
      
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (!apiKey) {
          throw new Error('YouTube API key is not configured');
        }

        console.log('Fetching solutions for contest:', contestName);

        const solutions = await searchContestSolutions(contestName, channelId, apiKey);
        setVideos(solutions);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch solutions';
        setError(errorMessage);
        console.error('Error in ContestSolutions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [contestName, channelId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!videos.length) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-gray-500 text-center">No solutions found for this contest</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Contest Solutions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="relative w-40 h-24 rounded-md overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{video.channelTitle}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(video.publishedAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="ml-2">Watch</span>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 