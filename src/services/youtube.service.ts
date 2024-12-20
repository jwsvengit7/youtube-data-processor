import axios from 'axios';
import { logger } from '../utils/logger';

class YouTubeService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  async getVideoInfo(videoId: string) {
    try {
      const url = `${this.baseUrl}/videos?part=snippet,statistics&id=${videoId}&key=${this.apiKey}`;
      const { data, headers } = await axios.get(url);

      this.checkRateLimit(headers);

      if (!data.items || data.items.length === 0) {
        throw new Error(`No video found for ID: ${videoId}`);
      }

      const video = data.items[0];
      return {
        title: video.snippet.title,
        description: video.snippet.description,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
      };
    } catch (error: any) {
      logger.error(`Error fetching video info for videoId: ${videoId} - ${error.message}`);
      throw error;
    }
  }

  async getVideoComments(videoId: string) {
    try {
      let url = `${this.baseUrl}/commentThreads?part=snippet&videoId=${videoId}&key=${this.apiKey}` || null;
      let allComments: any[] = [];

      while (url) {
        const { data, headers } = await axios.get(url);

        this.checkRateLimit(headers);

        if (!data.items || data.items.length === 0) {
          break;
        }

        const comments = data.items.map((item: any) => ({
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          comment: item.snippet.topLevelComment.snippet.textOriginal,
          likeCount: item.snippet.topLevelComment.snippet.likeCount,
        }));

        allComments.push(...comments);
        url = data.nextPageToken ? `${this.baseUrl}/commentThreads?part=snippet&videoId=${videoId}&key=${this.apiKey}&pageToken=${data.nextPageToken}` : null;
      }

      return allComments;
    } catch (error: any) {
      logger.error(`Error fetching video comments for videoId: ${videoId} - ${error.message}`);
      throw error;
    }
  }

  private checkRateLimit(headers: any) {
    const remaining = headers['x-ratelimit-remaining'];
    const resetTime = headers['x-ratelimit-reset'];

    if (remaining === '0') {
      const resetDate = new Date(Number(resetTime) * 1000);
      logger.warn(`Rate limit reached. Reset at ${resetDate.toISOString()}`);
    }
  }
}

export default YouTubeService;
