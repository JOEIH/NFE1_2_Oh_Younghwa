import { reviewAxiosClient, validateTokenAxiosClient } from '../../../shared/utils/axiosClient';
import { Follow, MoviePost, User } from '../../TimelinePage/model/article';

//다른 유저의 마이페이지 보기
export const getOtherUsers = async (userId: string): Promise<User> => {
  const request = reviewAxiosClient();
  const response = await request.get<User>(`/users/${userId}`);

  return response.data;
};

//팔로우
export const followUser = async (userId: string): Promise<Follow> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 없습니다');
    }
    const request = validateTokenAxiosClient(token);
    const response = await request.post<Follow>('/follow/create', {
      userId: userId,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('팔로우 실패');
  }
};

//언팔로우
export const unfollowUser = async (followId: string): Promise<Follow> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 없습니다');
    }
    const request = validateTokenAxiosClient(token);
    const response = await request.delete<Follow>('/follow/delete', {
      data: { id: followId },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('언팔로우 실패');
  }
};

//영화리뷰 전체 가져오기
export const getAllReviews = async (channel: string): Promise<MoviePost[]> => {
  const request = reviewAxiosClient();

  const response = await request.get(`/search/all/${channel}`);
  return response.data;
};

//로그아웃
export const logoutUser = async (): Promise<void> => {
  try {
    //토큰이 있는 사용자인지 확인
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 없습니다');
    }
    const request = validateTokenAxiosClient(token);
    const response = await request.post('/logout', {});

    if (response.status === 200) {
      console.log('로그아웃 성공');
      localStorage.removeItem('token');
    } else if (response.status === 401) {
      console.log('로그아웃 실패: 인증되지 않은 사용자입니다.');
    }

    return response.data;
  } catch (error) {
    console.log('로그아웃 실패');
    throw new Error('로그아웃 실패');
  }
};
