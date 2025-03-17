export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

interface YouTubeSearchItem {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    thumbnails?: {
      medium?: {
        url?: string;
      };
    };
    publishedAt?: string;
    channelTitle?: string;
  };
}

export async function searchContestSolutions(contestName: string, channelId: string, apiKey: string): Promise<YouTubeVideo[]> {
  try {
    const params = new URLSearchParams({
      key: apiKey,
      part: 'snippet',
      channelId: channelId,
      q: contestName,
      type: 'video',
      maxResults: '5',
      order: 'relevance'
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('YouTube API Error:', data);
      throw new Error(`YouTube API Error: ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      id: item.id?.videoId || '',
      title: item.snippet?.title || '',
      thumbnail: item.snippet?.thumbnails?.medium?.url || '',
      publishedAt: item.snippet?.publishedAt || '',
      channelTitle: item.snippet?.channelTitle || ''
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
} 