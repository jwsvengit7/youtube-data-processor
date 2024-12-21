

import { Request, Response } from 'express';
import YouTubeService from '../services/youtube.service';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
dotenv.config();

class Youtube {
  public youTubeService: YouTubeService;

  constructor() {
    this.youTubeService = new YouTubeService(process.env.YOUTUBE_API_KEY as string);
  }

 public getVideoDetails = async (req: Request, res: Response) => {
    try {
      const { videoId } = req.params;
      const videoData = await this.youTubeService.getVideoInfo(videoId);
      res.json(videoData);
      logger.info(`Fetched video details for videoId: ${videoId}`);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
       logger.warn('Rate limit exceeded while fetching video details.');
         res.status(429).json({
          message: 'Rate limit exceeded. Please try again later.',
        });
        return;
      }
      
      logger.error(`Failed to fetch video details for videoId: ${req.params.videoId} - ${error.message}`);
      res.status(500).json({ message: 'Failed to fetch video details', error: error.message });
    }
  };

  public getVideoComments = async (req: Request, res: Response) => {
    try {
      const { videoId } = req.params;
      const comments = await this.youTubeService.getVideoComments(videoId);
      res.json(comments);
     logger.info(`Fetched comments for videoId: ${videoId}`);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
       logger.warn('Rate limit exceeded while fetching video comments.');
         res.status(429).json({
          message: 'Rate limit exceeded. Please try again later.',
        });
        return;
      }
     logger.error(`Failed to fetch comments for videoId: ${req.params.videoId} - ${error.message}`);
      res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
  };
}

export default Youtube;
