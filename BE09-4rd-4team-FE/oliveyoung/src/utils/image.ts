import { BASE_IMAGE_URL } from '@/constants/imageBase';

/** 전체 이미지 URL을 반환 */
export const getImageUrl = (path: string) => `${BASE_IMAGE_URL}${path}`;
